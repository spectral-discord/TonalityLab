import type { CreateTuningInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import TuningForm from 'src/components/Tuning/TuningForm'

const CREATE_TUNING_MUTATION = gql`
  mutation CreateTuningMutation($input: CreateTuningInput!) {
    createTuning(input: $input) {
      id
    }
  }
`

const NewTuning = () => {
  const [createTuning, { loading, error }] = useMutation(CREATE_TUNING_MUTATION, {
    onCompleted: () => {
      toast.success('Tuning created')
      navigate(routes.tunings())
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const onSave = (input: CreateTuningInput) => {
    createTuning({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Tuning</h2>
      </header>
      <div className="rw-segment-main">
        <TuningForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewTuning
