import { useState, useEffect } from 'react'

import { /* CodeBrackets, InputField, */ EyeClose, EyeEmpty, SaveFloppyDisk } from 'iconoir-react'
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
  const [useEditor, setUseEditor] = useState(true)
  const [updateTuning, { loading, error }] = useMutation(UPDATE_TUNING_MUTATION, {
    onCompleted: () => {
      toast.success('Tuning updated')
      navigate(routes.tunings())
    },
    onError: error => {
      toast.error(error.message)
    }
  })
  const [tsonErrors, setTsonErrors] = useState([])
  const [tsonInvalid, setTsonInvalid] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)

  const { register, setValue, handleSubmit, watch } = useForm<UpdateTuningInput>()

  const tsonInput = watch('tson')
  const isPrivate = watch('private')

  useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 640 && openMenu && setOpenMenu(false))
  }, [openMenu])

  useEffect(() => {
    register('tson')
    setValue('tson', YAML.stringify(new TSON(tuning.tson).findTuningById(tuning.id)))
  }, [register, setValue, tuning.id, tuning.tson])

  const onSubmit: SubmitHandler<UpdateTuningInput> = (input: UpdateTuningInput) => {
    const parsedInput = YAML.parse(input.tson)
    parsedInput.id = tuning.id
    input.name = parsedInput.name
    input.description = parsedInput.description
    input.tson = YAML.stringify({ tunings: [parsedInput] })
    updateTuning({ variables: { id: tuning.id, input } })
  }

  const onChange = (input: string) => {
    const parsedInput = YAML.parse(input)
    parsedInput.id = tuning.id

    const fullTson = { tunings: [parsedInput] }

    try {
      const tson = new TSON()
      tson.load(YAML.stringify(fullTson))
      setTsonErrors([])
      setTsonInvalid(false)
    } catch (ex) {
      const error = ex.message.includes('Invalid TSON!') ? ex.message.split('\n')[1].slice(1) : ex.message
      const markers = []
      setTsonInvalid(true)

      if (
        error.includes('Expression invalid, unable to parse') ||
        error.includes('Expression must evaluate to a positive number')
      ) {
        const badExpression = error.includes('Expression invalid, unable to parse')
          ? error.slice(38, -1)
          : error.slice(48, -1)

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
        fullTson.tunings.forEach(tuning => {
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

        console.log(YAML.stringify(notes))

        const regexStr = YAML.stringify(notes)
          .split('\n')
          .map(line => `(${line.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')})`)
          .join('(\n)( +)?')

        console.log(input.split(RegExp(regexStr))[0])

        const startLineNumber = input.split(RegExp(regexStr))[0].split('\n').length
        const startColumn = input.split('\n')[startLineNumber].split('-')[0].length + 1
        const endLineNumber = startLineNumber + notes.length - 1
        const endColumn = input.split('\n')[endLineNumber - 1].length + 1
        markers.push({ startLineNumber, startColumn, endLineNumber, endColumn, message: error })
      }

      setTsonErrors(markers)
    }

    setValue('tson', input)
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
          {/* <button
            className="icon-button"
            onClick={() => {
              setOpenMenu(false)
              setUseEditor(!useEditor)
            }}
            title={`Switch to ${useEditor ? 'tuning form' : 'text editor'}`}
            aria-label={`use ${useEditor ? 'input forms' : 'text editor'}`}
          >
            {useEditor ? <InputField className="icon" /> : <CodeBrackets className="icon" />}
          </button> */}
          <button
            className="icon-button sm:ml-4"
            onClick={handleSubmit(onSubmit)}
            title={'Save'}
            aria-label={'Save'}
            disabled={tsonInvalid}
          >
            <SaveFloppyDisk className="icon" />
          </button>
          <button
            className="icon-button sm:ml-4 sm:hidden"
            onClick={() => setValue('private', !isPrivate)}
            title={`Make ${isPrivate ? 'public' : 'private'}`}
            aria-label={`Make ${isPrivate ? 'public' : 'private'}`}
          >
            {isPrivate ? <EyeClose className="icon" /> : <EyeEmpty className="icon" />}
          </button>
        </div>
      </header>
      <div className={`${useEditor ? 'h-full' : 'p-4'}`}>
        {useEditor ? (
          <TSONEditor
            tson={tsonInput}
            tsonErrors={tsonErrors}
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
