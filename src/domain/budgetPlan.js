import moment from 'moment';
import _ from 'lodash';

class Period {
    constructor(startDate, endDate) {
        this.startDate = moment(startDate, 'YYYY-MM-DD');
        this.endDate = moment(endDate, 'YYYY-MM-DD');
    }

    dayCount() {
        if (this.endDate.isBefore(this.startDate)) {
            return 0;
        }
        return this.endDate.diff(this.startDate, 'days') + 1;
    }

    getOverlappingDays(budget) {
        let start = this.startDate.isBefore(budget.getPeriod().startDate) ? budget.getPeriod().startDate : this.startDate;
        let end = this.endDate.isAfter(budget.getPeriod().endDate) ? budget.getPeriod().endDate : this.endDate;
        let overlappingDayCount = new Period(start, end).dayCount();
        return overlappingDayCount;
    }
}

class Budget {
    constructor(month, amount) {
        this.amount = amount || 0;
        this.period = new Period(moment(month, 'YYYY-MM').startOf('month'), moment(month, 'YYYY-MM').endOf('month'));
    }

    dayCount() {
        return this.period.dayCount();
    }

    getPeriod() {
        return this.period;
    }

    getAmountOfOverlapping(period) {
        let overlappingDayCount = period.getOverlappingDays(this);
        return overlappingDayCount * (this.amount / this.dayCount());
    }
}

export class BudgetPlan {
    budgets = {};

    query(startDate, endDate) {
        const period = new Period(startDate, endDate);
        return _(this.budgets).chain().map((amount, month) => new Budget(month, amount)).sumBy(budget => budget.getAmountOfOverlapping(period)).value();
    }
}

