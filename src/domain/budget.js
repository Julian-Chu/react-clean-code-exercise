import moment from 'moment'

export class Budget {
    budgets = {};

    query(startDate, endDate) {
        const momentStartDate = moment(startDate, 'YYYY-MM-DD');
        const momentEndDate = moment(endDate, 'YYYY-MM-DD');

        if (momentStartDate.isSame(momentEndDate, 'month')) {
            const diffDays = momentEndDate.diff(momentStartDate, 'days') + 1;
            const budget = ((this.budgets[momentStartDate.month()] || 0) / momentStartDate.daysInMonth()) * diffDays;
            return budget;
        } else {
            let budget = 0;

            // start month
            const numberOfDaysInStartMonth = getNumbersOfDaysInStartMonth(startDate);
            const amountDaysFirst = moment(momentStartDate.month(), 'YYYY-MM').daysInMonth();
            const firstMonthBudget = this.budgets[momentStartDate.month()] || 0;
            const totalBudgetFirstMonth = numberOfDaysInStartMonth * (firstMonthBudget / amountDaysFirst);
            budget += totalBudgetFirstMonth;

            // months in between
            const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(startDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                const budgetThisMonth = this.budgets[monthString] || 0;
                budget += budgetThisMonth;
            }

            // end month
            const numberOfDaysInLastMonth = getNumbersOfDaysInEndMonth(endDate);
            const amountDaysLast = moment(momentEndDate.month(), 'YYYY-MM').daysInMonth();
            const lastMonthBudget = this.budgets[momentEndDate.month()] || 0;
            const totalBudgetLastMonth = numberOfDaysInLastMonth * (lastMonthBudget / amountDaysLast);
            budget += totalBudgetLastMonth;
            return budget
        }
    }
}

export const getNumbersOfDaysInStartMonth = date => {
    const startDate = moment(date, 'YYYY-MM-DD');
    const endDate = moment(date, 'YYYY-MM-DD').endOf('month');
    const remainingDays = endDate.diff(startDate, 'days');

    return remainingDays + 1;
};

export const getNumbersOfDaysInEndMonth = date => {
    const endDate = moment(date, 'YYYY-MM-DD');
    const startDate = moment(date, 'YYYY-MM-DD').startOf('month');
    const remainingDays = endDate.diff(startDate, 'days');

    return remainingDays + 1;
};
