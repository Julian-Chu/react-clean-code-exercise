import React from 'react'
import Profile from '../../components/Profile';
import {shallow} from 'enzyme'
import Api from "../../api";


describe('profile', () => {

    it('save', () => {
        const profile = {name: 'Wilson', birthday: { year: 1990, month: 6, day: 26}};
        Api.getProfile = jest.fn().mockReturnValue(profile);
        Api.updateProfile = jest.fn();

        const wrapper = shallow(<Profile/>);
        wrapper.instance().save();
        expect(Api.updateProfile).toHaveBeenCalledWith(profile);
    });
});