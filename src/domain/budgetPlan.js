import moment from 'moment'

class Period {
    constructor(startDate, endDate) {
        this.startDate = moment(startDate, 'YYYY-MM-DD');
        this.endDate = moment(endDate, 'YYYY-MM-DD');
    }

    dayCount() {
        return this.endDate.diff(this.startDate, 'days') + 1;
    }
}

class Budget {
    constructor(month, amount) {
        this.month = month;
        this.amount = amount || 0;
    }

    dayCount() {
        return new Period(moment(this.month, 'YYYY-MM').startOf('month'), moment(this.month, 'YYYY-MM').endOf('month')).dayCount();
    }

}

export class BudgetPlan {
    budgets = {};

    query(startDate, endDate) {
        const period = new Period(startDate, endDate);
        if (period.startDate.isSame(period.endDate, 'month')) {
            return this.getAmountByPeriod(new Period(period.startDate, period.endDate), new Budget(period.startDate.format('YYYY-MM'), this.budgets[period.startDate.format('YYYY-MM')]));
        } else {
            let budget = 0;

            // start month
            budget += this.getAmountByPeriod(new Period(
                period.startDate,
                moment(period.startDate).endOf("month")
            ), new Budget(period.startDate.format('YYYY-MM'), this.budgets[period.startDate.format('YYYY-MM')]));

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
            ), new Budget(period.endDate.format('YYYY-MM'), this.budgets[period.endDate.format('YYYY-MM')]));
            return budget
        }
    }

    getAmountByPeriod(period, budget) {
        return period.dayCount() * (budget.amount / budget.dayCount());
    }
}

