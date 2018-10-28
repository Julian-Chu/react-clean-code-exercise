import moment from 'moment'

export class Budget {
    budgets = {};

    query(startDate, endDate) {
        const momentStartDate = moment(startDate, 'YYYY-MM-DD');
        const momentEndDate = moment(endDate, 'YYYY-MM-DD');

        if (momentStartDate.isSame(momentEndDate, 'month')) {
            const diffDays = momentEndDate.diff(momentStartDate, 'days') + 1;
            const budget = ((this.budgets[momentStartDate.format("YYYY-MM")] || 0) / momentStartDate.daysInMonth()) * diffDays;
            return budget;
        } else {
            let budget = 0;

            // start month
            const totalBudgetFirstMonth = this.getAmountByPeriod(momentStartDate);
            budget += totalBudgetFirstMonth;

            // months in between
            const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(momentStartDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                const budgetThisMonth = this.budgets[monthString] || 0;
                budget += budgetThisMonth;
            }

            // end month
            const totalBudgetLastMonth = this.getAmountByPeriod(null, endDate);
            budget += totalBudgetLastMonth;
            return budget
        }
    }

    getAmountByPeriod(startDate, endDate = null) {
        const start = startDate ? moment(startDate) : moment(endDate).startOf('month');
        const end = endDate ? moment(endDate) : moment(startDate).endOf('month');
        const numberOfDaysInStartMonth = end.diff(start, 'days') + 1;
        const amountDaysFirst = start.daysInMonth();
        const firstMonthBudget = this.budgets[start.format('YYYY-MM')] || 0;
        const totalBudgetFirstMonth = numberOfDaysInStartMonth * (firstMonthBudget / amountDaysFirst);
        return totalBudgetFirstMonth;
    }
}

export const getNumbersOfDaysInEndMonth = date => {
    const endDate = moment(date, 'YYYY-MM-DD');
    const startDate = moment(date, 'YYYY-MM-DD').startOf('month');
    const remainingDays = endDate.diff(startDate, 'days');

    return remainingDays + 1;
};
