import Api from "../api";
import {FORMAT, NOT_EMPTY, POSITIVE_NUMBER, Validator} from "./Validator";

export default class AddBudgetAction {
  errors = {}
  validator = new Validator({
    month: [NOT_EMPTY, FORMAT],
    amount: [NOT_EMPTY, POSITIVE_NUMBER]
  })

  do(budget, success) {
    this.validator.validate(budget, () => {
      let budgets = Api.getBudgets()
      let existing = budgets && budgets.find(existedBudget => existedBudget.month === budget.month)
      if (existing) {
        Api.updateBudget(budget)
      } else {
        Api.addBudget(budget)
      }

      success()
    })
    Object.assign(this.errors, this.validator.errors)
  }
}