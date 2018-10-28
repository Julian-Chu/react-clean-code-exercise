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
            budget += this.getAmountByPeriod(momentStartDate, moment(momentStartDate).endOf("month"));

            // months in between
            const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(momentStartDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                budget += this.budgets[monthString] || 0;
            }

            // end month
            budget += this.getAmountByPeriod(moment(momentEndDate).startOf("month"), momentEndDate);
            return budget
        }
    }

    getAmountByPeriod(startDate, endDate) {
        const budgetOfMonth = this.budgets[startDate.format('YYYY-MM')] || 0;
        return (endDate.diff(startDate, 'days') + 1) * (budgetOfMonth / startDate.daysInMonth());
    }
}

