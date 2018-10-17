import {FORMAT, NOT_EMPTY, POSITIVE_NUMBER, Validator} from "./Validator";
import Api from "../api";

class Budget {
  constructor({month, amount}) {
    this.amount = amount || 0;
    this.month = month
  }

  save() {
    let budgets = Api.getBudgets()
    let existing = budgets && budgets.find(existedBudget => existedBudget.month === this.month)
    if (existing) {
      Api.updateBudget({month: this.month, amount: this.amount})
    } else {
      Api.addBudget({month: this.month, amount: this.amount})
    }
  }
}

export default class AddBudgetPresenter {
  errors = {}
  validator = new Validator({
    month: [NOT_EMPTY, FORMAT],
    amount: [NOT_EMPTY, POSITIVE_NUMBER]
  })

  do(budget, success) {
    this.validator.validate(budget, () => {
      new Budget(budget).save();
      success()
    })
    Object.assign(this.errors, this.validator.errors)
  }
}