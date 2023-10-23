import TuningCell from 'src/components/Tuning/TuningCell'

type TuningPageProps = {
  id: string
}

const TuningPage = ({ id }: TuningPageProps) => {
  return <TuningCell id={id} />
}

export default TuningPage
