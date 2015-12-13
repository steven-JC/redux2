'use strict';

var process=require('./process').process;

var info=null;


function redux2Middleware_(actions,binders) {
	return function(_ref){
		let action;
	  
	  var getState = _ref.getState;
	  return function (next) {
	    return function (action) {
	    	
	    	let actionName,stateName;
	    	
	    	if(typeof action === 'object'){
	    		if(action['_REDUX2_ACTION_NAME_']){
	    			
		    		actionName=action['_REDUX2_ACTION_NAME_'];
		    		stateName=action['_REDUX2_STATE_NAME_'];
		    		action=actions[actionName](action.data);
		    		
			    }else{
			    	throw 'unknow error.';
			    }
	    	}
	    	
	    	if(typeof action === 'function' ){ 
	    		action = action(dispatch, getState);
	    		return next({type:Symbol(),[stateName]:action});
			}else {
				next({type:Symbol(),[action['_REDUX2_STATE_NAME_']]:action});
			}
			
			function dispatch(arg1,arg2){
				var action;
			  	if(typeof arg1 === 'string') {
			  		// dispatch('increment',{step:2});
					action=actions[arg1](arg2);
					if(typeof action==='function') return action(dispatch, getState);
					else return next({type:Symbol(),[binders[arg1]]:action});
			  	}else if(typeof arg1 === 'function'){
			  		return arg1(dispatch, getState);
			  	}else{
			  		// dispatch({n:3});
			  		return next({type:Symbol(),[stateName]:arg1});
			  	}
			  }
	    };
	  };
	}
}

function reducerMaker(conf){
	info=process(conf);
	return info.reducers;
}

function redux2(store){
	
	const dispatch=store.dispatch;
	const {actions,binders}=info;
	
	store.dispatch=function(arg1,arg2){
		if(typeof arg1==='string'){
			var obj={};
			obj['_REDUX2_ACTION_NAME_']=arg1;
			obj['_REDUX2_STATE_NAME_']=binders[arg1];
			obj.data=arg2;
		}else{
			throw 'the first argument of dispatch should be string';
			return;
		}
		dispatch.call(this,obj);
	}

}

function redux2Middleware(){
	return redux2Middleware_(info.actions,info.binders);
}


	






exports.__esModule = true;
exports['redux2'] = redux2;
exports['reducerMaker'] = reducerMaker;
exports['redux2Middleware'] = redux2Middleware;

