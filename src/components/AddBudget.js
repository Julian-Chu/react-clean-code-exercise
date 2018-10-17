import React from 'react'
import Api from "../api";
import AddBudgetPresenter from "../domain/AddBudgetAction";

export default class AddBudget extends React.Component {
    presenter = new AddBudgetPresenter();

    state = {
    budget: {
      month: '',
      amount: 0
    },
    errors: {
      month: '',
      amount: ''
    }
  }
  _goToBudgetList() {
    this.props.history.push('/budgets')
  }

  save() {
    this.presenter.do(this.state.budget,
        () => this._goToBudgetList(),
        errors => this.setState({errors}))
  }
  cancel(){
    this._goToBudgetList()
  }

  handleChange(field) {
    let {budget} = this.state
    return event => this.setState({budget: Object.assign(budget, {[field]: event.target.value})})
  }

  render() {
    let {budget, errors} = this.state
    return (
      <div>
        <h2>Add Budget</h2>
        <div className="form-item">
          <div className="label">
            <label>Month</label>
          </div>
          <div className="editor">
            <input type="text" value={budget.month} onChange={this.handleChange('month')} placeholder="Month YYYY-MM"/>
          </div>
          <div className="error">
            <span>{errors.month}</span>
          </div>
        </div>
        <div className="form-item">
          <div className="label">
            <label>Amount</label>
          </div>
          <div className="editor">
            <input type="number" value={budget.amount} onChange={this.handleChange('amount')} placeholder="Amount"/>
          </div>
          <div className="error">
            <span>{errors.amount}</span>
          </div>
        </div>
        <div className="form-item">
          <button onClick={() => this.save()} className="button">Save</button>
          <button onClick={() => this.cancel()} className="button">Cancel</button>
        </div>
      </div>
    )
  }

}