import { Router, Route, Set } from '@redwoodjs/router'

import LabLayout from 'src/layouts/LabLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={LabLayout}>
        <Route path="/tunings/new" page={TuningNewTuningPage} name="newTuning" />
        <Route path="/tunings/{id}/edit" page={TuningEditTuningPage} name="editTuning" />
        <Route path="/tunings/{id}" page={TuningTuningPage} name="tuning" />
        <Route path="/tunings" page={TuningTuningsPage} name="tunings" />
        <Route path="/" page={HomePage} name="home" />
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
