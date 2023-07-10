import type { /* DeleteTuningMutationVariables, */ FindTunings } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { timeSince } from 'src/lib/time'
/* 
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Tuning/TuningsCell'

const DELETE_TUNING_MUTATION = gql`
  mutation DeleteTuningMutation($id: String!) {
    deleteTuning(id: $id) {
      id
    }
  }
`
*/
const TuningsList = ({ tunings }: FindTunings) => {
  /* Commenting these out until user pages/auth are completed
  const [deleteTuning] = useMutation(DELETE_TUNING_MUTATION, {
    onCompleted: () => {
      toast.success('Tuning deleted')
    },
    onError: error => {
      toast.error(error.message)
    },
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true
  })

  const onDeleteClick = (id: DeleteTuningMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete tuning ' + id + '?')) {
      deleteTuning({ variables: { id } })
    }
  }
  */

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {tunings.map(tuning => (
            <tr key={tuning.id}>
              <td aria-label="Tuning Name">
                <Link to={routes.tuning({ id: tuning.id })} title="Show tuning detail" className="font-semibold underline">
                  {tuning.name || 'No Name'}
                </Link>
              </td>
              <td aria-label="Tuning Description">{tuning.description || 'No Description'}</td>
              <td title={tuning.updatedAt} aria-label="Last Updated">
                {timeSince(tuning.updatedAt) + ' ago'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TuningsList
