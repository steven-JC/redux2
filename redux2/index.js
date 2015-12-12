'use strict';

exports.__esModule = true;
exports['default'] = redux2Middleware;

function redux2Middleware(actionMaker) {
	return function(_ref){
	  var dispatch = function(action){
	  	if(typeof action === 'function') _ref.dispatch(action)
	  	else if(typeof action === 'object'){
	  		action.type=Symbol();
	  		_ref.dispatch(action);
	  	}
	  }
	  var getState = _ref.getState;
	  return function (next) {
	    return function (action) {
	    	if(action._REDUX2_KEY_){
	    		action=actionMaker[action._REDUX2_KEY_](action.data);
		    }
	    	if(typeof action === 'function' ) action(dispatch, getState) 
				else {
					action.type=Symbol();
					next(action);
				}
	    };
	  };
	}
}

function redux2(store){
	const dispatch=store.dispatch;
	store.dispatch=function(arg1,arg2){
		if(typeof arg1==='string'){
			var obj={};
			obj['_REDUX2_KEY_']=arg1;
			obj.data=arg2;
		}else{
			throw 'the first argument of dispatch should be string';
			return;
		}
		dispatch.call(this,obj);
	}
}


module.exports = {
	redux2:redux2,
	redux2Middleware:redux2Middleware,
};