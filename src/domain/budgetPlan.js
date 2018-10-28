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

    getPeriod() {
        return new Period(moment(this.month, 'YYYY-MM').startOf('month'), moment(this.month, 'YYYY-MM').endOf('month'));
    }

}

export class BudgetPlan {
    budgets = {};

    query(startDate, endDate) {
        const period = new Period(startDate, endDate);
        if (period.startDate.isSame(period.endDate, 'month')) {
            return this._getAmountOfOverlapping(period, new Budget(period.startDate.format('YYYY-MM'), this.budgets[period.startDate.format('YYYY-MM')]));
        } else {
            let budget = 0;

            // start month
            budget += this._getAmountOfOverlapping(
                period
                , new Budget(period.startDate.format('YYYY-MM'), this.budgets[period.startDate.format('YYYY-MM')]));

            // months in between
            const monthDiff = period.endDate.diff(period.startDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(period.startDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                budget += this.budgets[monthString] || 0;
            }

            // end month
            budget += this._getAmountOfOverlapping(
                period
                , new Budget(period.endDate.format('YYYY-MM'), this.budgets[period.endDate.format('YYYY-MM')]));
            return budget
        }
    }

    _getAmountOfOverlapping(period, budget) {
        let overlappingDayCount = this._getOverlappingDays(period, budget);
        return overlappingDayCount * (budget.amount / budget.dayCount());
    }

    _getOverlappingDays(period, budget) {
        let start = period.startDate.isBefore(budget.getPeriod().startDate) ? budget.getPeriod().startDate : period.startDate;
        let end = period.endDate.isAfter(budget.getPeriod().endDate) ? budget.getPeriod().endDate : period.endDate;
        let overlappingDayCount = new Period(start, end).dayCount();
        return overlappingDayCount;
    }

    getAmountByPeriod(period, budget) {
        return period.dayCount() * (budget.amount / budget.dayCount());
    }
}

