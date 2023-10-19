import React, { useRef, useEffect } from 'react'

import { evaluate } from 'mathjs'
import { editor, Uri, MarkerSeverity, Range } from 'monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'
import { TSON } from 'tsonify'
import YAML from 'yaml'

interface Props {
  tson: string
  schema?: string
  onChange: (tuning: string, containsErrors: boolean) => void
}

self.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case 'json':
        return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url))
      case 'yaml':
        return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
      default:
        throw new Error(`Unknown label ${label}`)
    }
  }
}

const TSONEditor = ({ tson, schema = 'tson', onChange = () => {} }: Props) => {
  const divEl = useRef<HTMLDivElement>(null)
  let tsonEditor: editor.IStandaloneCodeEditor
  let schemaUrl = 'https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tson.json'

  if (schema === 'tuning') {
    schemaUrl = 'https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tuning.json'
  } else if (schema === 'spectrum') {
    schemaUrl = 'https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/spectrum.json'
  } else if (schema === 'set') {
    schemaUrl = 'https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/set.json'
  }

  const modelUri = Uri.parse(schemaUrl)

  // register json schema
  setDiagnosticsOptions({
    enableSchemaRequest: true,
    hover: true,
    completion: true,
    validate: true,
    format: true,
    schemas: [
      {
        uri: schemaUrl,
        fileMatch: [String(modelUri)]
      }
    ]
  })

  useEffect(() => {
    const model = editor.getModel(modelUri)
    if (model && model.getValue() !== tson) {
      editor.getModel(modelUri)?.setValue(tson)
    }
  }, [tson, modelUri])

  useEffect(() => {
    const model = editor.createModel(tson, 'yaml', modelUri)

    model.onDidChangeContent(() => {
      onInputChange(model.getValue())
    })

    if (divEl.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      tsonEditor = editor.create(divEl.current, {
        language: 'yaml',
        model,
        quickSuggestions: { other: true, strings: true, comments: true },
        quickSuggestionsDelay: 5,
        tabSize: 2,
        automaticLayout: true, // for detecting window size changes
        // the rest is just paring down styling & features for simplicity
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbersMinChars: 3,
        scrollbar: {
          useShadows: false
        },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        fontFamily: 'Fira Code',
        contextmenu: false
      })

      window.onresize = () => {
        tsonEditor.layout({} as editor.IDimension)
      }
    }

    return () => {
      model.dispose()
      tsonEditor.dispose()
    }
  }, [])

  /**
   * Evaluates expression strings and adds the resulting value as a to
   * the end of the line containing the expression as a decoration
   */
  const createExpressionDecorations = (input: string, parsedInput: TSON) => {
    const editorEl = document.getElementById('tson-editor')
    const styleEl = document.createElement('style')
    const styleSheet = editorEl.appendChild(styleEl).sheet

    const splitInput = input.split('\n')
    const decorations = []
    const expressions = []

    // Find all expressions
    parsedInput.tunings?.forEach(tuning => {
      tuning.scales.forEach(scale => {
        const repeat = scale.repeat ?? scale['repeat ratio']

        if (repeat && typeof repeat === 'string') {
          expressions.push(repeat)
        }

        scale.notes.map(note => {
          let noteString = note

          if (typeof note === 'object') {
            noteString = note.ratio ?? note['frequency ratio']
          }

          if (typeof noteString === 'string') {
            expressions.push(noteString)
          }
        })
      })
    })

    parsedInput.spectra?.forEach(spectrum => {
      const partials = spectrum.partials || spectrum['partial distribution']
      partials.forEach(partial => {
        const ratio = partial.ratio ?? partial['frequency ratio']
        const weight = partial.weight ?? partial['amplitude weight']

        if (typeof ratio === 'string') {
          expressions.push(ratio)
        }

        if (typeof weight === 'string') {
          expressions.push(weight)
        }
      })
    })

    // Map expression strings into decoration objects
    expressions.forEach(expression => {
      const escapedExpr = expression.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

      splitInput.forEach((line, lineIndex) => {
        const regex = RegExp(`^(- )?(([a-z]| )+: )?( +)?(${escapedExpr})|("${escapedExpr}")|('${escapedExpr}')$`)
        if (line.trim().match(regex)) {
          const rule = `.inline-decoration-${lineIndex + 1}::after {
            content: 'Value: ${evaluate(expression)}';
            margin-left: 2em;
            color: #769cfc;
            font-style: italic;
          }`
          styleSheet.insertRule(rule)

          decorations.push({
            range: new Range(lineIndex + 1, 0, lineIndex + 1, line.length + 1),
            options: { afterContentClassName: `inline-decoration-${lineIndex + 1}` }
          })
        }
      })
    })

    return decorations
  }

  /**
   * Creates warnings for errors that aren't captured by the JSON schema
   */
  const createMarkers = (input: string, parsedInput: TSON, error: string) => {
    const markers = []

    if (
      error.includes('Expression invalid, unable to parse') ||
      error.includes('Expression must evaluate to a positive number')
    ) {
      const badExpression = error.includes('Expression invalid, unable to parse') ? error.slice(38, -1) : error.slice(48, -1)

      const escapedExpr = badExpression.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

      input.split('\n').forEach((line, lineIndex) => {
        const regex = RegExp(`^(- )?(([a-z]| )+: )?( +)?(${escapedExpr})|("${escapedExpr}")|('${escapedExpr}')$`)
        if (line.trim().match(regex)) {
          const index = line.indexOf(badExpression) + 1
          markers.push({
            startLineNumber: lineIndex + 1,
            startColumn: index,
            endLineNumber: lineIndex + 1,
            endColumn: index + badExpression.length,
            message: error
          })
        }
      })
    } else if (error.includes('The notes array contains frequency ratios that evaluate to the same value')) {
      const [expression1, expression2] = error.slice(76, -1).split('", "')

      let notes
      parsedInput.tunings.forEach(tuning => {
        tuning.scales.forEach(scale => {
          const reducedNotes = scale.notes.map(note => {
            if (typeof note === 'object') {
              return String(note.ratio ?? note['frequency ratio'])
            }

            return String(note)
          })

          if (reducedNotes.includes(expression1) && reducedNotes.includes(expression2)) {
            notes = scale.notes
          }
        })
      })

      const noteLines = YAML.stringify(notes).split('\n')
      const regexStr = noteLines
        .map(line => `(${line.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')})`)
        .join('(\n)( +)?')

      const startLineNumber = input.split(RegExp(regexStr))[0].split('\n').length
      const startColumn = input.split('\n')[startLineNumber].split('-')[0].length + 1
      const endLineNumber = startLineNumber + noteLines.length - 2
      const endColumn = input.split('\n')[endLineNumber - 1].length + 1
      markers.push({ startLineNumber, startColumn, endLineNumber, endColumn, message: error })
    }

    return markers
  }

  const onInputChange = (input: string) => {
    let parsedInput = YAML.parse(input)
    let containsErrors = false
    let markers = []
    let decorations = []

    // Make it a full TSON if this is only a subset
    if (schema === 'tuning') {
      parsedInput = { tunings: [parsedInput] }
    } else if (schema === 'spectrum') {
      parsedInput = { spectra: [parsedInput] }
    } else if (schema === 'set') {
      parsedInput = { sets: [parsedInput] }
    }

    // Check if the TSON is valid and create markers if not
    try {
      const tson = new TSON()
      tson.load(YAML.stringify(parsedInput))
      decorations = createExpressionDecorations(input, parsedInput)
    } catch (ex) {
      containsErrors = true
      const error = ex.message.includes('Invalid TSON!') ? ex.message.split('\n')[1].slice(1) : ex.message
      markers = createMarkers(input, parsedInput, error)
    }

    onChange(input, containsErrors)

    const currentDecorations = tsonEditor.getDecorationsInRange(new Range(0, 0, 9999, 9999))
    tsonEditor.removeDecorations(currentDecorations.map(d => d.id))
    tsonEditor.createDecorationsCollection(decorations)

    editor.setModelMarkers(
      tsonEditor.getModel(),
      '',
      markers.map(err => ({ ...err, severity: MarkerSeverity.Warning }))
    )
  }

  return <div className="Editor h-full" id="tson-editor" ref={divEl}></div>
}

export default TSONEditor
