import React from 'react';
import {NavLink} from 'react-router-dom'
import './Header.css'

export default class Header extends React.Component {
  state = {
    profile: { name: 'Jackson', birthday: {month: 10, day: 18}}
  }
  profileCaption() {
    let {profile: {name}} = this.state
    return name === '' ? 'Profile' : `${name}${this._isBirthday() ? '🎂' : ''}`
  }
  getDate() {
    return new Date();
  }
  _isBirthday(){
    let today = this.getDate()
    let {profile: {birthday: {month, day}}} = this.state
    return today.getMonth() === month - 1 && today.getDate() === day
  }
  render() {
    return (
      <header className="clearfix">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile" style={{float: 'right'}}>{this.profileCaption()}</NavLink>
      </header>
    )
  }
}
