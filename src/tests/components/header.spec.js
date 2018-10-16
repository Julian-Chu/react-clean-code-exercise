import React from 'react'
import Header from '../../components/Header';
import {shallow} from 'enzyme'

describe('header', () => {
    let wrapper;
    const RealDate = Date;
    const DATE_TO_USE = new Date('2018-10-18');

    beforeEach(() => {
        wrapper = shallow(<Header/>);
    });
    afterEach(() => {
        global.Date = RealDate;
    });

    it('default value', () => {
        expect(wrapper.instance().profileCaption()).toEqual('Jackson');
    });
    it('is birthday', () => {
        global.Date = jest.fn(() => DATE_TO_USE);
        expect(wrapper.instance().profileCaption()).toEqual('Jackson🎂');
    });
});