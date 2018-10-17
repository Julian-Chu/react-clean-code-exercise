import _, {upperFirst} from "lodash";

export const notEmpty = value => value !== ''
export const emptyError = field => `${upperFirst(field)} cannot be empty`
export const format = value => (/^\d{4}-\d{2}$/g).test(value)
export const formatError = field => `Invalid ${field} format`
export const positiveError = field => `Invalid ${field}`
export const positiveNumber = value => !isNaN(parseInt(value, 10)) && value >= 0
export const NOT_EMPTY = {validate: notEmpty, error: emptyError}
export const FORMAT = {validate: format, error: formatError}
export const POSITIVE_NUMBER = {validate: positiveNumber, error: positiveError}

export class Validator {
  errors = {}

  constructor(rules) {
    this.rules = rules
  }

  validate(data, success) {
    for (let field in this.rules) {
      let fail = this.rules[field].find(validation => !validation.validate(data[field])) || {error: () => ''}
      this.errors[field] = fail.error(field)
    }

    this.valid && success()
  }

  get valid() {
    return _.chain(this.errors).values().compact().isEmpty().value();
  }
}