

export function increment() {
	
	 
	return {
		type : 'increment',
		state : {
			n : state.n++
		}
	}
}

increment.reducer = 'count';

function reducer(state, action) {
	return Object.assign({}, state, action.state);
}

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
	export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'

	export function increment() {
	return {
		type : INCREMENT_COUNTER
	}
}

export function decrement() {
	return {
		type : DECREMENT_COUNTER
	}
}

export function incrementIfOdd() {
	return (dispatch, getState) =  > {
		const {
			counter
		}
			 = getState()

			if (counter.n % 2 === 0) {
				return
			}

			dispatch(increment())
	}
}

export function incrementAsync(delay = 1000) {
	return dispatch =  > {
		setTimeout(() =  > {
				dispatch(increment())
			}, delay)
	}
}
