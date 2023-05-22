import { render } from '@redwoodjs/testing/web'

import LabLayout from './LabLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LabLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LabLayout />)
    }).not.toThrow()
  })
})
