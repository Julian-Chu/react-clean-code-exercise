import Api from "../api";

export class Budgets {
  budgets;
  constructor() {
    this.budgets = Api.getBudgets()
  }
  addOrUpdate(budget, success) {
    let existing = this.budgets && this.budgets.find(existedBudget => existedBudget.month === budget.month)
    if (existing) {
      Api.updateBudget(budget)
    } else {
      Api.addBudget(budget)
    }

    success()
  }
}