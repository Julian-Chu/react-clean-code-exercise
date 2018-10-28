import moment from 'moment'

export class Budget {
    budgets = {};

    query(startDate, endDate) {
        const momentStartDate = moment(startDate, 'YYYY-MM-DD');
        const momentEndDate = moment(endDate, 'YYYY-MM-DD');

        if (momentStartDate.isSame(momentEndDate, 'month')) {
            return this.getAmountByPeriod(momentStartDate, momentEndDate);
        } else {
            let budget = 0;

            // start month
            budget += this.getAmountByPeriod(momentStartDate);

            // months in between
            const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(momentStartDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                budget += this.budgets[monthString] || 0;
            }

            // end month
            budget += this.getAmountByPeriod(null, endDate);
            return budget
        }
    }

    getAmountByPeriod(startDate, endDate = null) {
        const start = startDate ? moment(startDate) : moment(endDate).startOf('month');
        const end = endDate ? moment(endDate) : moment(startDate).endOf('month');
        const budgetOfMonth = this.budgets[start.format('YYYY-MM')] || 0;
        return (end.diff(start, 'days') + 1) * (budgetOfMonth / start.daysInMonth());
    }
}

export const getNumbersOfDaysInEndMonth = date => {
    const endDate = moment(date, 'YYYY-MM-DD');
    const startDate = moment(date, 'YYYY-MM-DD').startOf('month');
    const remainingDays = endDate.diff(startDate, 'days');

    return remainingDays + 1;
};
