import React, { useRef, useEffect } from 'react'

import { editor, Uri, MarkerSeverity } from 'monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'

interface ErrorData {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
  message: string
}

interface Props {
  tson: string
  tsonErrors: ErrorData[]
  schemaUrl?: string
  onChange: (tuning: string) => void
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

const TSONEditor = ({
  tson,
  tsonErrors,
  schemaUrl = 'https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tson.json',
  onChange = tuning => tuning
}: Props) => {
  const divEl = useRef<HTMLDivElement>(null)
  let tsonEditor: editor.IStandaloneCodeEditor
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
    const markers = tsonErrors.map(err => ({ ...err, severity: MarkerSeverity.Warning }))
    editor.setModelMarkers(editor.getModel(modelUri), '', markers)
  }, [tsonErrors, modelUri])

  useEffect(() => {
    const model = editor.getModel(modelUri);
    if (model && model.getValue() !== tson) {
      editor.getModel(modelUri)?.setValue(tson)
    }
  }, [tson, modelUri])

  useEffect(() => {
    const model = editor.createModel(tson, 'yaml', modelUri)

    model.onDidChangeContent(() => {
      onChange(model.getValue())
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

  return <div className="Editor h-full" ref={divEl}></div>
}

export default TSONEditor
