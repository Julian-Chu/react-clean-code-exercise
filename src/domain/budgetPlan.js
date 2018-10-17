import moment from 'moment'

class Period {
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  dayCount() {
    return this.end.diff(this.start, 'days') + 1
  }

  getOverlappingDayCount(another) {
    let endOfOverlapping = this.end.isBefore(another.end) ? this.end : another.end;
    let startOfOverlapping = this.start.isAfter(another.start) ? this.start : another.start
    return new Period(startOfOverlapping, endOfOverlapping).dayCount();
  }
}

class Budget {
  constructor(month, amount) {
    this.amount = amount || 0
    this.month = month
  }

  dayCount(){
    return this.getPeriod().dayCount()
  }

  getEnd() {
    return moment(this.month, 'YYYY-MM').endOf('month')
  }

  getStart() {
    return moment(this.month, 'YYYY-MM').startOf('month')
  }

  getPeriod() {
    return new Period(this.getStart(), this.getEnd())
  }

  getAmountOfOverlapping(period) {
    return this.amount / this.dayCount() * period.getOverlappingDayCount(this.getPeriod());
  }
}

export class BudgetPlan {
  budgets = {}

  query(startDate, endDate) {
    return this._query(new Period(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')))
  }

  _query(period){
    let totalAmount = 0

    const monthDiff = period.end.diff(period.start, 'months') + 1
    for (let month = 0; month <= monthDiff; month++) {
      const monthString = moment(period.start)
        .add(month, 'month')
        .format('YYYY-MM')
      let budget = new Budget(monthString, this.budgets[monthString]);
      totalAmount += budget.getAmountOfOverlapping(period)
    }

    return totalAmount
  }
}




