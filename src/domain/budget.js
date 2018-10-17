import moment from 'moment'

class Budget {
    constructor(month, amount){
        this.amount = amount || 0;
        this.month = month
    }

    dayCount() {
        return this.getPeriod().dayCount();
    }

    getEnd() {
        return moment(this.month, 'YYYY-MM').endOf('month');
    }

    getStart() {
        return moment(this.month, 'YYYY-MM').startOf('month')
    }

    getPeriod() {
        return new Period(this.getStart(), this.getEnd())
    }

    getAmountOfOverlapping(period) {
        let overlappingDayCount = period.getOverlappingDayCount(this.getPeriod());
        return this.amount / this.dayCount() * overlappingDayCount;
    }
}

class Period {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
    dayCount() {
      return this.end.diff(this.start, 'days') + 1;
    }
    getOverlappingDayCount(another) {
        let endOfOverlapping = this.end.isBefore(another.end) ? this.end : another.end;
        let startOfOverlapping = this.start.isAfter(another.start) ? this.start : another.start;
        return new Period(startOfOverlapping, endOfOverlapping).dayCount();
    }
}

export class BudgetPlan {
  budgets = {}

  query(startDate, endDate) {
    const momentStartDate = moment(startDate, 'YYYY-MM-DD')
    const momentEndDate = moment(endDate, 'YYYY-MM-DD')
    const period = new Period(momentStartDate, momentEndDate);

    return this._query(period);
  }

  _query(period) {
      if (period.start.isSame(period.end, 'month')) {
          let firstBudget = new Budget(period.start.format('YYYY-MM'),
              this.budgets[period.start.format('YYYY-MM')]);
          return firstBudget.getAmountOfOverlapping(period);
      } else {
          let totalAmount = 0

          // start month
          let firstBudget = new Budget(period.start.format('YYYY-MM'),
              this.budgets[period.start.format('YYYY-MM')]);
          totalAmount += firstBudget.getAmountOfOverlapping(period)

          // months in between
          const monthDiff = period.end.diff(period.start, 'months') - 1
          for (let month = 1; month <= monthDiff; month++) {
              const monthString = moment(period.start)
                  .add(month, 'month')
                  .format('YYYY-MM')
              let budget = new Budget(monthString, this.budgets[monthString]);
              totalAmount += budget.getAmountOfOverlapping(period)
          }

          // end month
          let lastBudget = new Budget(period.end.format('YYYY-MM'),
              this.budgets[period.end.format('YYYY-MM')]);
          totalAmount += lastBudget.getAmountOfOverlapping(period)
          return totalAmount
      }
  }

}
