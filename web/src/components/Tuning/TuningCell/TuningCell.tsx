import type { FindTuningById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Tuning from 'src/components/Tuning/Tuning'

export const QUERY = gql`
  query FindTuningById($id: String!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Tuning not found</div>

export const Failure = ({ error }: CellFailureProps) => <div className="rw-cell-error">{error?.message}</div>

export const Success = ({ tuning }: CellSuccessProps<FindTuningById>) => {
  return <Tuning tuning={tuning} />
}
