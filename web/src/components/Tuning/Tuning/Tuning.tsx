import { TSON } from 'tsonify'
import type { DeleteTuningMutationVariables, FindTuningById } from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DELETE_TUNING_MUTATION = gql`
  mutation DeleteTuningMutation($id: String!) {
    deleteTuning(id: $id) {
      id
    }
  }
`

interface Props {
  tuning: NonNullable<FindTuningById['tuning']>
}

const Tuning = ({ tuning }: Props) => {
  const tson = new TSON(tuning.tson)
  const parsedTuning = tson.findTuningById(tuning.id)
  console.log(parsedTuning)

  const [deleteTuning] = useMutation(DELETE_TUNING_MUTATION, {
    onCompleted: () => {
      toast.success('Tuning deleted')
      navigate(routes.tunings())
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const onDeleteClick = (id: DeleteTuningMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tuning ' + id + '?')) {
      deleteTuning({ variables: { id } })
    }
  }

  return (
    <>
      <nav className="rw-button-group float-right -mt-0.5">
        <Link to={routes.editTuning({ id: tuning.id })} className="rw-button rw-button-blue">
          Edit
        </Link>
        <button type="button" className="rw-button rw-button-red" onClick={() => onDeleteClick(tuning.id)}>
          Delete
        </button>
      </nav>
      <h2 className="mb-6 text-lg font-semibold">{tuning.name} (Tuning)</h2>
      <div className="flex px-4">
        <div className="mr-5 self-center font-semibold">Description</div>
        {tuning.description}
      </div>
      <div className="flex">
        
      </div>
    </>
  )
}

export default Tuning
