import { useState, useEffect } from 'react'

import { Code, InputField, SaveFloppyDisk } from 'iconoir-react'
import { useForm, SubmitHandler } from 'react-hook-form'
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

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UpdateTuningInput>()

  const tsonInput = watch('tson')

  useEffect(() => {
    const tson = new TSON(tuning.tson)
    const tuningString = YAML.stringify(tson.findTuningById(tuning.id))

    register('tson')
    setValue('tson', tuningString)
  }, [register, setValue, tuning])

  const onSubmit: SubmitHandler<UpdateTuningInput> = (input: UpdateTuningInput) => {
    updateTuning({ variables: { id: tuning.id, input } })
  }

  return (
    <div className={`rw-segment overflow-visible ${useEditor ? 'flex grow flex-col' : 'h-fit'}`}>
      <header className="rw-segment-header flex w-full items-center">
        <h2 className="rw-heading flex grow flex-wrap">
          <span className="mr-2 truncate">{tuning?.name}</span>
          <span className="text-sm text-pink">[ tuning ]</span>
        </h2>
        <div className="flex items-center">
          <button
            className="icon-button mr-4"
            onClick={handleSubmit(onSubmit)}
            title={`Save`}
            aria-label={`use ${useEditor ? 'input forms' : 'text editor'}`}
          >
            <SaveFloppyDisk className="icon" />
          </button>
          <button
            className="icon-button"
            onClick={() => setUseEditor(!useEditor)}
            title={`Switch to ${useEditor ? 'tuning form' : 'text editor'}`}
            aria-label={`use ${useEditor ? 'input forms' : 'text editor'}`}
          >
            {useEditor ? <InputField className="icon" /> : <Code className="icon" />}
          </button>
        </div>
      </header>
      <div className={`${useEditor ? 'h-full' : 'p-4'}`}>
        {useEditor ? (
          <TSONEditor
            tson={tsonInput}
            schemaUrl="https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tuning.json"
            onChange={tuning => setValue('tson', YAML.stringify({ tunings: [YAML.parse(tuning)] }))}
          />
        ) : (
          <TuningForm tuning={tuning} error={error} loading={loading} />
        )}
      </div>
    </div>
  )
}
