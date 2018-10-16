import moment from 'moment'

export class Budget {
  budgets = {}

  query(startDate, endDate) {
    const momentStartDate = moment(startDate, 'YYYY-MM-DD')
    const momentEndDate = moment(endDate, 'YYYY-MM-DD')

    if (momentStartDate.isSame(momentEndDate, 'month')) {
      return this._getAmountOfPeriod(momentStartDate, momentEndDate)
    } else {
      let budget = 0

      // start month
      budget += this._getAmountOfPeriod(momentStartDate, moment(momentStartDate).endOf('month'))

      // months in between
      const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1
      for (let month = 1; month <= monthDiff; month++) {
        const monthString = moment(startDate, 'YYYY-MM-DD')
          .add(month, 'month')
          .format('YYYY-MM')
        budget += this.budgets[monthString] || 0
      }

      // end month
      budget += this._getAmountOfPeriod(moment(momentEndDate).startOf('month'), momentEndDate)
      return budget
    }
  }

  _getAmountOfPeriod(start, end) {
      const diffDays = end.diff(start, 'days') + 1
      let dayCountOfFirstBudget = start.daysInMonth();
      let amountOfFirstBudget = (this.budgets[start.format('YYYY-MM')] || 0);
      return amountOfFirstBudget / dayCountOfFirstBudget * diffDays;
  }
}
