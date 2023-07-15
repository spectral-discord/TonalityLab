import { useState } from 'react'

import { Code, InputField } from 'iconoir-react'
import { TSON } from 'tsonify'
import type { EditTuningById, UpdateTuningInput } from 'types/graphql'
import YAML from 'yaml'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TSONEditor from 'src/components/TSONEditor/TSONEditor'
import TuningForm from 'src/components/Tuning/TuningForm'

export const QUERY = gql`
  query EditTuningById($id: String!) {
    tuning: tuning(id: $id) {
      id
      authorId
      public
      name
      description
      tson
      createdAt
      updatedAt
    }
  }
`
const UPDATE_TUNING_MUTATION = gql`
  mutation UpdateTuningMutation($id: String!, $input: UpdateTuningInput!) {
    updateTuning(id: $id, input: $input) {
      id
      authorId
      public
      name
      description
      tson
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => <div className="rw-cell-error">{error?.message}</div>

export const Success = ({ tuning }: CellSuccessProps<EditTuningById>) => {
  const tson = new TSON(tuning.tson)
  const tuningString = YAML.stringify(tson.findTuningById(tuning.id))

  const [useEditor, setUseEditor] = useState(false)
  const [updateTuning, { loading, error }] = useMutation(UPDATE_TUNING_MUTATION, {
    onCompleted: () => {
      toast.success('Tuning updated')
      navigate(routes.tunings())
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const onSave = (input: UpdateTuningInput, id: EditTuningById['tuning']['id']) => {
    updateTuning({ variables: { id, input } })
  }

  return (
    <div className={`rw-segment overflow-visible ${useEditor ? 'flex grow flex-col' : 'h-fit'}`}>
      <header className="rw-segment-header">
        <h2 className="rw-heading pr-8">Edit tuning: {tuning?.name}</h2>
        <button
          className="icon-button float-right -mt-6 inline-block"
          onClick={() => setUseEditor(!useEditor)}
          title={`Switch to ${useEditor ? 'tuning form' : 'text editor'}`}
          aria-label={`use ${useEditor ? 'input forms' : 'text editor'}`}
        >
          {useEditor ? <InputField className="icon" /> : <Code className="icon" />}
        </button>
      </header>
      <div className={`${useEditor ? 'h-full' : 'p-4'}`}>
        {useEditor ? (
          <TSONEditor
            tson={tuningString}
            schemaUrl="https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tuning.json"
          />
        ) : (
          <TuningForm tuning={tuning} onSave={onSave} error={error} loading={loading} />
        )}
      </div>
    </div>
  )
}
