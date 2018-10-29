import Api from "../api";

export default class AddBudgetAction {
    do(budget, success, failure) {
        let errors = {}
        let monthValid, amountValid
        if (budget.month === '') {
            errors.month = 'Month cannot be empty'
            monthValid = false
        } else if (!(/^\d{4}-\d{2}$/g).test(budget.month)) {
            errors.month = 'Invalid month format'
            monthValid = false
        } else {
            errors.month = ''
            monthValid = true
        }
        if (budget.amount === '') {
            errors.amount = 'Amount cannot be empty'
            amountValid = false
        } else if (isNaN(parseInt(budget.amount, 10)) || budget.amount < 0) {
            errors.amount = 'Invalid amount'
            amountValid = false
        } else {
            errors.amount = ''
            amountValid = true
        }
        if (!monthValid || !amountValid) {
            failure(errors);
            return
        }
        let budgets = Api.getBudgets()
        let existing = budgets && budgets.find(existedBudget => existedBudget.month === budget.month)
        if (existing) {
            Api.updateBudget(budget)
        } else {
            Api.addBudget(budget)
        }
        success();
    }
}