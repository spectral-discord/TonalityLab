import EditTuningCell from 'src/components/Tuning/EditTuningCell'

type TuningPageProps = {
  id: string
}

const EditTuningPage = ({ id }: TuningPageProps) => {
  return <EditTuningCell id={id} />
}

export default EditTuningPage
