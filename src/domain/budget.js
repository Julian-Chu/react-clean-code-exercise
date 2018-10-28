import moment from 'moment'

class Period {
    startDate;
    endDate;

    constructor(startDate, endDate) {
        this.startDate = moment(startDate, 'YYYY-MM-DD');
        this.endDate = moment(endDate, 'YYYY-MM-DD');
    }

}

export class Budget {
    budgets = {};

    query(startDate, endDate) {
        // const momentStartDate = moment(startDate, 'YYYY-MM-DD');
        // const momentEndDate = moment(endDate, 'YYYY-MM-DD');
        const period = new Period(startDate, endDate);
        if (period.startDate.isSame(period.endDate, 'month')) {
            return this.getAmountByPeriod(new Period(period.startDate, period.endDate));
        } else {
            let budget = 0;

            // start month
            budget += this.getAmountByPeriod(new Period(
                period.startDate,
                moment(period.startDate).endOf("month")
            ));

            // months in between
            const monthDiff = period.endDate.diff(period.startDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(period.startDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                budget += this.budgets[monthString] || 0;
            }

            // end month
            budget += this.getAmountByPeriod(new Period(
                moment(period.endDate).startOf("month"),
                period.endDate
            ));
            return budget
        }
    }

    getAmountByPeriod(period) {
        const budgetOfMonth = this.budgets[period.startDate.format('YYYY-MM')] || 0;
        return (period.endDate.diff(period.startDate, 'days') + 1) * (budgetOfMonth / period.startDate.daysInMonth());
    }
}

