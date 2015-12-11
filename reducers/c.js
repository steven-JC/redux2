import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter'

export default function counter(state = {n:0}, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return {n:state.n + 1}
    case DECREMENT_COUNTER:
      return {n:state.n - 1}
    default:
      return {...state}
  }
}
