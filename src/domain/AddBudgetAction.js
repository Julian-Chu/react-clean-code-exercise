import Api from "../api";
import {FORMAT, NOT_EMPTY, POSITIVE_NUMBER, Validator} from "./Validator";

export default class AddBudgetAction {
  do(budget, success, failure) {
    let errors = {}

    let validator = new Validator({
      month: [NOT_EMPTY, FORMAT],
      amount: [NOT_EMPTY, POSITIVE_NUMBER]
    })
    validator.validate(budget, (field, error) => errors[field] = error)

    if (!validator.valid) {
      failure(errors)
      return
    }
    let budgets = Api.getBudgets()
    let existing = budgets && budgets.find(existedBudget => existedBudget.month === budget.month)
    if (existing) {
      Api.updateBudget(budget)
    } else {
      Api.addBudget(budget)
    }
    // this._goToBudgetList()
    success()
  }
}