import React from 'react'
import { shallow } from 'enzyme'

import MainVizComponent from './MainVizComponent'

describe('MainVizComponent', () => {
  let component, props

  beforeEach(() => {
    props = {}
    component = shallow(<MainVizComponent {...props} />)
  })

  it('should', () => {
    expect(component).toMatchSnapshot()
  })
})