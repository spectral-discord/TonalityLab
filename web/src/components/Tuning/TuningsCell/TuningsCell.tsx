import type { FindTunings } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Tunings from 'src/components/Tuning/Tunings'

export const QUERY = gql`
  query FindTunings {
    tunings {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No tunings yet. '}
      <Link to={routes.newTuning()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => <div className="rw-cell-error">{error?.message}</div>

export const Success = ({ tunings }: CellSuccessProps<FindTunings>) => {
  return <Tunings tunings={tunings} />
}
