import {FORMAT, NOT_EMPTY, POSITIVE_NUMBER, Validator} from "./Validator";
import {Budgets} from "./Budgets";

export default class AddBudgetPresenter {
  errors = {}
  validator = new Validator({
    month: [NOT_EMPTY, FORMAT],
    amount: [NOT_EMPTY, POSITIVE_NUMBER]
  })

  do(budget, success) {
    this.validator.validate(budget, () => {
      new Budgets().addOrUpdate(budget, success)
    })
    Object.assign(this.errors, this.validator.errors)
  }
}