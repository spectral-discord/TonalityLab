import { useState, useEffect } from 'react'

import { CodeBrackets, InputField, SaveFloppyDisk } from 'iconoir-react'
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
      private
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
      private
      name
      description
      tson
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
  const [tsonError, setTsonError] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UpdateTuningInput>()

  const tsonInput = watch('tson')

  useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 640 && openMenu && setOpenMenu(false))
  }, [openMenu])

  useEffect(() => {
    const tson = new TSON(tuning.tson)

    register('tson')
    setValue('tson', YAML.stringify(tson.findTuningById(tuning.id)))
  }, [register, setValue, tuning.id, tuning.tson])

  const onSubmit: SubmitHandler<UpdateTuningInput> = (input: UpdateTuningInput) => {
    const parsedInput = YAML.parse(input.tson)
    parsedInput.id = tuning.id
    input.name = parsedInput.name
    input.description = parsedInput.description
    input.tson = YAML.stringify({ tunings: [parsedInput] })

    try {
      const tson = new TSON()
      tson.load(input.tson)
    } catch (ex) {
      setTsonError(ex)
      return
    }

    setTsonError(null)
    updateTuning({ variables: { id: tuning.id, input } })
  }

  const onChange = (input: string) => {
    const parsedInput = YAML.parse(input)
    parsedInput.id = tuning.id

    try {
      const tson = new TSON()
      tson.load(YAML.stringify({ tunings: [parsedInput] }))
      setTsonError(null)
    } catch (ex) {
      setTsonError(ex)
    }

    setValue('tson', YAML.stringify(parsedInput))
  }

  return (
    <div className={`rw-segment overflow-visible ${useEditor ? 'flex grow flex-col' : 'h-fit'}`}>
      <header className="rw-segment-header flex w-full items-center">
        <h2 className="rw-heading flex grow flex-wrap items-center sm:grow-0">
          <span className="mr-2 truncate">{tuning?.name}</span>
          <a
            href="https://garden.spectraldiscord.com/#/page/tson%20specification/block/tunings"
            className="relative bottom-px text-sm text-pink hover:underline hover:decoration-2"
            target="_blank"
            rel="noreferrer"
            title="Tuning specification"
          >
            [ tuning ]
          </a>
        </h2>
        <div className="ml-8 hidden grow items-center sm:flex">
          <input
            name="private"
            className="checkbox"
            type="checkbox"
            title="Make tuning private"
            defaultChecked={tuning.private}
            id="privateCheckbox"
            {...register('private')}
          />
          <label className="ml-2 text-sm font-semibold hover:cursor-pointer" htmlFor="privateCheckbox">
            Private
          </label>
        </div>
        <button
          className="flex h-6 w-6 flex-col items-center justify-center sm:hidden"
          onClick={() => setOpenMenu(!openMenu)}
          title={`${openMenu ? 'Close' : 'Open'} editor menu`}
          aria-label={`${openMenu ? 'close' : 'open'} editor menu`}
        >
          <div className={`hamburger-line ${openMenu && 'translate-y-1.5 rotate-45'}`} />
          <div className={`hamburger-line ${openMenu && 'opacity-0'}`} />
          <div className={`hamburger-line ${openMenu && '-translate-y-1.5 -rotate-45'}`} />
        </button>
        <div className={`${!openMenu && 'hidden'} editor-button-group`}>
          <button
            className="icon-button"
            onClick={() => {
              setOpenMenu(false)
              setUseEditor(!useEditor)
            }}
            title={`Switch to ${useEditor ? 'tuning form' : 'text editor'}`}
            aria-label={`use ${useEditor ? 'input forms' : 'text editor'}`}
          >
            {useEditor ? <InputField className="icon" /> : <CodeBrackets className="icon" />}
          </button>
          <button
            className="icon-button sm:ml-4"
            onClick={handleSubmit(onSubmit)}
            title={`Save`}
            aria-label={`use ${useEditor ? 'input forms' : 'text editor'}`}
          >
            <SaveFloppyDisk className="icon" />
          </button>
        </div>
      </header>
      <div className={`${useEditor ? 'h-full' : 'p-4'}`}>
        {useEditor ? (
          <TSONEditor
            tson={tsonInput}
            schemaUrl="https://raw.githubusercontent.com/spectral-discord/TSON/main/schema/tuning.json"
            onChange={onChange}
          />
        ) : (
          <TuningForm tuning={tuning} error={error} loading={loading} />
        )}
      </div>
    </div>
  )
}
