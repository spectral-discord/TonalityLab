import { Router, Route, Set } from '@redwoodjs/router'

import LabLayout from 'src/layouts/LabLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={LabLayout}>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
