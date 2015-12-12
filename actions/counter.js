

export function increment() {

	return (dispatch, getState) => {
		const { counter } = getState()

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
