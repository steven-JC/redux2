
export default {n:0};

export function increment() {
	return (dispatch, getState) => {
		const {counter={n:0}}= getState();
		/*
		 dispatch('decrement',data)
		 dispatch({n:0});
		 
		 * */
		dispatch('decrement');
		return dispatch({
			n:counter.n+1,
			mata:{error:null,code:200,status:'SUCCESS'}
		});
	}
}

export function decrement() {
	return (dispatch, getState) => {
		
		const {counter={n:0}}= getState();
		return dispatch({
			n:counter.n-1,
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
	return (dispatch, getState) => {
		setTimeout(() => { increment()(dispatch, getState); }, 2000);
		
	}
}


/*async function(){
	await new Promise(function (resolve, reject) {
		setTimeout(() => { increment()(dispatch, getState);resolve() }, 2000);
	});
}
*/

