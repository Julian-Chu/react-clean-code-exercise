import React from 'react'
import Profile from '../../components/Profile'
import Api from '../../api'
import {shallow} from 'enzyme'

describe('Profile', () => {
  let profile = {name: 'Jackson', birthday: {year: 2018, month: 9, day: 18}}
  Api.getProfile = jest.fn().mockReturnValue(profile)
  it('save', () => {
    let savedProfile
    Api.updateProfile = profile => { savedProfile = profile}//jest.fn()
    let wrapper = shallow(<Profile/>)

    wrapper.setState({profile: {name: 'Joey', birthday:{year: 2018, month: 9, day: 18}}})
    wrapper.instance().save()

    // expect(Api.updateProfile).toHaveBeenCalledWith({name: 'JoeyAAA', birthday:{year: 2018, month: 9, day: 18}})
    expect(savedProfile).toEqual({name: 'JoeyAAA', birthday:{year: 2018, month: 9, day: 18}})
  })
})
