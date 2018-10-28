import moment from 'moment'

class Period {
    constructor(startDate, endDate) {
        this.startDate = moment(startDate, 'YYYY-MM-DD');
        this.endDate = moment(endDate, 'YYYY-MM-DD');
    }

    dayCount() {
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
        this.month = month;
        this.amount = amount || 0;
    }

    dayCount() {
        return new Period(moment(this.month, 'YYYY-MM').startOf('month'), moment(this.month, 'YYYY-MM').endOf('month')).dayCount();
    }

    getPeriod() {
        return new Period(moment(this.month, 'YYYY-MM').startOf('month'), moment(this.month, 'YYYY-MM').endOf('month'));
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
        if (period.startDate.isSame(period.endDate, 'month')) {
            let budget = new Budget(period.startDate.format('YYYY-MM'), this.budgets[period.startDate.format('YYYY-MM')]);
            return budget.getAmountOfOverlapping(period);
        } else {
            let totalAmount = 0;

            // start month
            let firstBudget = new Budget(period.startDate.format('YYYY-MM'), this.budgets[period.startDate.format('YYYY-MM')]);
            totalAmount += firstBudget.getAmountOfOverlapping(period);

            // months in between
            const monthDiff = period.endDate.diff(period.startDate, 'months') - 1;
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(period.startDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM');
                let budget = new Budget(monthString, this.budgets[monthString]);
                totalAmount += budget.getAmountOfOverlapping(period);
            }

            // end month
            let lastBudget = new Budget(period.endDate.format('YYYY-MM'), this.budgets[period.endDate.format('YYYY-MM')]);
            totalAmount += lastBudget.getAmountOfOverlapping(period);
            return totalAmount
        }
    }
}

