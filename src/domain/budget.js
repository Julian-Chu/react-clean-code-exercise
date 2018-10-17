import moment from 'moment'
import _ from 'lodash'

class Budget {
    constructor(month, amount){
        this.amount = amount || 0;
        this.month = month
    }

    get dayCount() {
        return this.period.dayCount;
    }

    get end() {
        return moment(this.month, 'YYYY-MM').endOf('month');
    }

    get start() {
        return moment(this.month, 'YYYY-MM').startOf('month')
    }

    get period() {
        return new Period(this.start, this.end)
    }

    getAmountOfOverlapping(period) {
        let overlappingDayCount = period.getOverlappingDayCount(this.period);
        return this.amount / this.dayCount * overlappingDayCount;
    }
}

class Period {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
    get dayCount() {
      if (this.end.isBefore(this.start)) {
          return 0
      }
      return this.end.diff(this.start, 'days') + 1;
    }
    getOverlappingDayCount(another) {
        let endOfOverlapping = this.end.isBefore(another.end) ? this.end : another.end;
        let startOfOverlapping = this.start.isAfter(another.start) ? this.start : another.start;
        return new Period(startOfOverlapping, endOfOverlapping).dayCount;
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
      return _(this.budgets).chain()
          .map((amount, month) => new Budget(month, amount))
          .sumBy(budget => budget.getAmountOfOverlapping(period))
          .value()
  }

}
