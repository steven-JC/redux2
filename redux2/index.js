'use strict';

exports.__esModule = true;
exports['redux2'] = redux2;
exports['reducerMaker'] = reducerMaker;
exports['redux2Middleware'] = redux2Middleware;

var info = null, localDispatch;

function redux2Middleware_(actions, binders) {
	return function (_ref) {
		let action;
		var getState = _ref.getState;
		return function (next) {
			return function (action) {
				//console.log(arguments);
				let actionName,
					stateName,arg=action;

				if (typeof action === 'object') {
					if (action['_REDUX2_ACTION_NAME_']) {

						if(!actions[action['_REDUX2_ACTION_NAME_']])
							throw 'please make sure the '+action['_REDUX2_ACTION_NAME_']+' exist.' ;

						actionName = action['_REDUX2_ACTION_NAME_'];
						stateName = binders[actionName];
						action = actions[actionName](action.data);

					} else {
						//其他类型的action直接流过
						return next(action);
					}
				}

				if(typeof action ==='undefined') return;

				if (typeof action === 'function') {

					let dispatch__=function(){
						var args=arguments;
						if(typeof args[0]==='string')
							return (async (args0,args1)=>{
								var stateName = binders[args0];
								if(!stateName) {
									throw "the state binded:"+args0+" is not found";
									return;
								}
								var action=actions[args0](args1),result;
								if(typeof action === 'function'){
									try {
										result = await action(dispatch__,getState__(stateName));
									}catch (e){
										console.error('error',e.message,e);
									}
								}else
									result=action;

								if(result){
									if(result.constructor===Object) {
										next({
											type : Symbol(),
											[stateName] : {...result}
										});
										return {...result};
									}
									else if(result.constructor===Array) {
										next({
											type : Symbol(),
											[stateName] : [...result]
										});
										return [...result];
									}else {
										next({
											type : Symbol(),
											[stateName] : result
										});
										return result;
									}
								}
							})(args[0],args[1]);
						else{
							return localDispatch(args[0],args[1]);
						}
					};

					let getState__=function(stateName){
						return function(otherState){
							var state=getState()[otherState||stateName];
							if(state){
								if(state.constructor===Object) {
									return {...state};
								}
								else if(state.constructor===Array) {
									return [...state];
								}else {
									return state;
								}
							}
							return state;
						}
					};

					action = action(dispatch__, getState__(stateName));//必须使用本地方法注入到action中

					if(typeof action ==='undefined') return;


					if(action.then){ // 执行根 Promise
						action.then(function(data){
							data=Object.assign({},data,{meta:{
								action:actionName,
								state:stateName
							}});
							next({
								type : Symbol(),
								[stateName] : data
							});
						},function (error) {
							localDispatch({error:error,action:arg});
						});
					}else{
						action=Object.assign({},action,{meta:{
							action:actionName,
							state:stateName
						}});
						return next({
							type : Symbol(),
							[stateName] : action
						});
					}

				} else {
					action=Object.assign({},action,{meta:{
						action:actionName,
						state:stateName
					}});
					return next({
						type : Symbol(),
						[stateName] : action
					});
				}

			};
		};
	}
}

function reducerMaker(conf) {
	info = process(conf);
	return info.reducers;
}

function redux2(store) {

	const dispatch = store.dispatch;
	const {
		actions,
		binders
		} = info;


	localDispatch=store.dispatch = function (arg1, arg2) {
		var obj;
		if (typeof arg1 === 'string') {
			obj = {};
			obj['_REDUX2_ACTION_NAME_'] = arg1;
			obj.data = arg2;
			return new Promise(function(resolve){
				resolve(dispatch.call(this, obj || arg1));
			});
		}
		return dispatch.call(this, obj || arg1);
	}
}

function redux2Middleware() {
	return redux2Middleware_(info.actions, info.binders);
}

function process(conf) {

	let[ reducers, actions, binders] = [{}, {}, {} ];



	for (let i = 0; i < conf.length; i++) {
		let req = conf[i];

		req.keys().forEach(function (name) {

			let key = name.replace(/.*?\/([a-zA-Z0-9_\$]+?)\.js/, function (item, $1) {
				return $1;
			});
			//get exported default value
			let obj = req(name);

			//enforce defaulting, should not be undefined
			if (typeof obj === 'undefined') {
				throw  ` the action ${name} should had a default value as "export default {...};" or "export default someValue;"` ;
				return;
			}
			// reset data
			if (obj == null)
				obj = {default:null};
			else if (obj.constructor !== Object)
				obj = { default:obj };

			//make the reducer function
			reducers[key] = (function (name, key, obj) {
				return function reducer(state, action) {
					//
					if (typeof state === 'undefined') {
						if (obj['default']&&obj['default'].constructor === Object) {
							return Object.assign({}, obj['default']);
						} else {
							return obj['default'] || null;
						}
					} else {
						//没更新
						if (typeof action[key] === 'undefined') {
							return state;
						} else {
							if (obj['default']&&obj['default'].constructor != Object)
								return action[key];
							else
								return Object.assign({}, state, action[key]);
						}
					}

				}
			})(name, key, obj);

			obj = {...obj};
			delete obj.default;
			Object.keys(obj).forEach((item) => {
				binders[item] = key;
			});
			Object.assign(actions, obj);

		});

	}

	return {
		actions : actions,
		reducers : reducers,
		binders : binders
	};
}