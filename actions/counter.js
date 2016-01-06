
export default {n:0};

export function increment() {

	return async (dispatch, getState) => {
		const {n}= getState();
		var rrrr=await dispatch('asyncGet');
		console.log('asyncGet',rrrr);
		var rrrrr=await dispatch('normalGet');
		console.log('normalGet',rrrrr);
		var rrrrrr=await dispatch('get');
		console.log('get',rrrrrr);
		var rrrrrrr=await dispatch('getByAsyncGet');
		console.log('getByAsyncGet',rrrrrrr);
		var rrrrrrrr=await dispatch('AsyncGetError');
		console.log('AsyncGetError',rrrrrrrr);
		return {
			n:n+1
		};
	}
}

//
export function decrement() {
	return {n:77}
}

//
export function incrementIfOdd() {
	return (dispatch, getState) => {
		const {n}= getState();

		if (n % 2 === 0) {
			return
		}
		return {n:n+1};
	}
}


export function incrementAsync() {
	return async (dispatch, getState) => {
		await new Promise(function (resolve, reject) {
			setTimeout(() => { resolve(); }, 1000);
		});
		dispatch('increment');
	}
}


export function asyncGet() {
	return async (dispatch, getState) => {
		return await new Promise(function (resolve, reject) {
			setTimeout(() => { resolve({n:99}); }, 1000);
		});
	}
}

export function normalGet() {
	return (dispatch, getState) => {
		return {n:888}
	}
}

export function get() {
	return {n:555}
}

export function getByAsyncGet() {
	return async (dispatch, getState) => {
		return await dispatch('asyncGet');
	}
}

export function AsyncGetError() {
	return async (dispatch, getState) => {
		throw "AsyncGetError";
		return {n:-1}
	}
}













