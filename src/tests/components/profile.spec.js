import React from 'react'
import Profile from '../../components/Profile';
import {shallow} from 'enzyme'
import Api from "../../api";


describe('profile', () => {
    let wrapper;
    let _store = {};
    global.localStorage = {
        getItem: key => {
            return _store[key];
        },
        setItem: (key, input) => {
            _store[key] = input;
        }
    };

    beforeEach(() => {
        Api.getProfile = jest.fn().mockReturnValue(null);
        // Api.updateProfile = jest.fn();
        wrapper = shallow(<Profile/>);
    });
    afterEach(() => {
        _store = {};
    });

    it('default value', () => {
        expect(wrapper.state().profile.name).toEqual('');
        expect(wrapper.state().profile.birthday.year).toEqual(1980);
        expect(wrapper.state().profile.birthday.month).toEqual(1);
        expect(wrapper.state().profile.birthday.day).toEqual(1);
    });

    it('save', () => {
        wrapper.instance().save();
        // expect(Api.updateProfile.mock.calls.length).toBe(1);
        const result = JSON.parse(_store['profile']);
        expect(result.birthday.year).toEqual(1980);
        expect(result.birthday.month).toEqual(1);
        expect(result.birthday.day).toEqual(1);
    });
});