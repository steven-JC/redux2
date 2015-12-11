import { combineReducers } from 'redux'

const [req, reducers] = [require.context('./', false, /.js$/), {}];

req.keys().forEach((name) => {
	let func=req(name)
	func.name&&Object.assign(reducers, {[func.name]:func})
});
 console.log(reducers);

export default combineReducers(reducers);

