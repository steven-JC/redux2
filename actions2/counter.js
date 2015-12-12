
export default {n:0};

export function increment() {
	return (dispatch, getState) => {
		const {counter={n:0}}= getState();
		return dispatch({
			counter:{n:counter.n+1},
			text:'increment',
			mata:{error:null,code:200,status:'SUCCESS'}
		});
	}
}

export function decrement() {
	return (dispatch, getState) => {
		const {counter={n:0}}= getState();
		return dispatch({
			counter:{n:counter.n-1},
			text:'decrement',
			mata:{error:null,code:200,status:'SUCCESS'}
		});
	}
}

export function incrementIfOdd() {
	return (dispatch, getState) => {
		const {counter}= getState();

		if (counter.n % 2 === 0) {
			return
		}
		increment()(dispatch, getState);
	}
}

export function incrementAsync() {
	return async (dispatch, getState) => {
		await new Promise(function (resolve, reject){
			setTimeout(resolve, 5000);
		});
		increment()(dispatch, getState);
	}
}



