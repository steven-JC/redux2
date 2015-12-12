import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter'

export default function text(state = 'add 1 if ood', action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return 'INCREMENT_COUNTER'
    case DECREMENT_COUNTER:
      return 'DECREMENT_COUNTER'
    default:
      return 'add 1 if ood'
  }
}
