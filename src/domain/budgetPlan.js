import moment from 'moment'
import _ from 'lodash'

class Period {
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  get dayCount() {
    if (this.end.isBefore(this.start)){
      return 0
    }
    return this.end.diff(this.start, 'days') + 1
  }

  getOverlappingDayCount(another) {
    let endOfOverlapping = this.end.isBefore(another.end) ? this.end : another.end;
    let startOfOverlapping = this.start.isAfter(another.start) ? this.start : another.start
    return new Period(startOfOverlapping, endOfOverlapping).dayCount
  }
}

class Budget {
  constructor(month, amount) {
    this.amount = amount || 0
    this.month = month
  }

  get dayCount(){
    return this.period.dayCount
  }

  get end() {
    return moment(this.month, 'YYYY-MM').endOf('month')
  }

  get start() {
    return moment(this.month, 'YYYY-MM').startOf('month')
  }

  get period() {
    return new Period(this.start, this.end)
  }

  getAmountOfOverlapping(period) {
    return this.amount / this.dayCount * period.getOverlappingDayCount(this.period);
  }
}

export class BudgetPlan {
  budgets = {}

  query(startDate, endDate) {
    return this._query(new Period(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')))
  }

  _query(period){
    return _(this.budgets).chain()
      .map((amount, month) => new Budget(month, amount))
      .sumBy(budget => budget.getAmountOfOverlapping(period))
      .value()
  }
}




