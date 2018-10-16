import React from 'react'
import Header from '../../components/Header';
import {shallow} from 'enzyme'
import TimeProvider from '../../domain/timeProvider';

describe('header', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Header/>);
    });

    it('not birthday', () => {
        TimeProvider.now = jest.fn().mockReturnValue(new Date('2018-10-17'));
        expect(wrapper.instance().profileCaption()).toEqual('Jackson');
    });
    it('is birthday', () => {
        TimeProvider.now = jest.fn().mockReturnValue(new Date('2018-10-18'));
        expect(wrapper.instance().profileCaption()).toEqual('Jackson🎂');
    });
});