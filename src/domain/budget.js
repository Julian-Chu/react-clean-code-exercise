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
        const monthString = moment(momentStartDate)
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
    const dayCountOfBudget = start.daysInMonth();
    const amountOfBudget = (this.budgets[start.format('YYYY-MM')] || 0);
    return amountOfBudget / dayCountOfBudget * diffDays;
  }
}




