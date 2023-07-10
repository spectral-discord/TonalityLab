import React, { useRef, useEffect } from 'react'

import { editor, Uri } from 'monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'

interface Props {
  tson: string
  schemaUrl?: string
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
  schemaUrl = 'https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tson.json'
}: Props) => {
  const divEl = useRef<HTMLDivElement>(null)
  let tsonEditor: editor.IStandaloneCodeEditor
  const modelUri = Uri.parse(schemaUrl)
  const model = editor.createModel(tson, 'yaml', modelUri)

  window.onresize = () => {
    tsonEditor.layout({} as editor.IDimension)
  }

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
    if (divEl.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      tsonEditor = editor.create(divEl.current, { language: 'yaml', model, automaticLayout: true })
    }
    return () => {
      tsonEditor.dispose()
      model.dispose()
    }
  }, [])

  return <div className="Editor h-full" ref={divEl}></div>
}

export default TSONEditor
