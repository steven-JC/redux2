exports.__esModule = true;
exports['redux2'] = redux2;
exports['reducerMaker'] = reducerMaker;
exports['redux2Middleware'] = redux2Middleware;

var info = null, localDispatch;

function redux2Middleware_(actionFuncs, func2MName) {
	return function (_ref) {
		let action;
		var getState = _ref.getState;
		return function (next) {
			return function (action) {
				//console.log(arguments);
				let actionName,
					modelName,arg=action;

				if (typeof action === 'object') {
					if (action['_REDUX2_ACTION_NAME_']) {

						actionName = action['_REDUX2_ACTION_NAME_'];
						modelName = func2MName[actionName];

						if(!actionFuncs[actionName])
							throw 'please make sure the function '+actionName+' exist.' ;

						action = actionFuncs[actionName](action.data);

					} else {
						//other action pass directly
						return next(action);
					}
				}

				if(typeof action ==='undefined') return;

				if (typeof action === 'function') {

					let dispatch__=function(){
						var args=arguments;
						if(typeof args[0]==='string') {
							return (async (args0, args1)=> {
								var modelName = func2MName[args0];
								if (!modelName) {
									throw "the state with " + args0 + " is not found, please make sure the function "+ args0 +" is exist";
									return;
								}

								var action = actionFuncs[args0](args1), result;
								if (typeof action === 'function') {
									try {
										result = await action(dispatch__, getState__(modelName));
									} catch (e) {
										let meta={meta:{
											action:args0,
											data:args1,
											model:modelName,
											error:e
										}};
										next({
											type: Symbol(),
											[modelName]: meta
										});
										console.error(meta.meta);
									}
								} else
									result = action;

								if (result)
									if( result.constructor !== Object){
										return result;
									}else{
										next({
											type: Symbol(),
											[modelName]: {...result,meta:{
												action:actionName,
												state:modelName,
											}}
										});
										return {...result};
									}
								return result;
							})(args[0], args[1]);
						}else{
							return localDispatch(args[0],args[1]);
						}
					};

					let getState__=function(defaultModel){
						return function(targetModel){
							var state=getState()[targetModel||defaultModel];
							if(!state) throw "please check that the model:"+targetModel+' is exist';
							return {...state};
						}
					};

					action = action(dispatch__, getState__(modelName));//必须使用本地方法注入到action中

					if(typeof action ==='undefined') return;


					if(action.then){ // run the root Promise
						action.then(function(data){

							data=Object.assign({},data,{meta:{
								action:actionName,
								state:modelName
							}});
							next({
								type : Symbol(),
								[modelName] : data
							});
						},function (error) {
							let meta={meta:{
								action:actionName,
								data:arg,
								model:modelName,
								error:error
							}};
							next({
								type: Symbol(),
								[modelName]: meta
							});
							console.error(meta.meta);
						});
					}else{
						action=Object.assign({},action,{meta:{
							action:actionName,
							state:modelName
						}});
						return next({
							type : Symbol(),
							[modelName] : action
						});
					}

				} else {
					action=Object.assign({},action,{meta:{
						action:actionName,
						state:modelName
					}});
					return next({
						type : Symbol(),
						[modelName] : action
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
		actionFuncs,
		func2MName
		} = info;


	localDispatch=store.dispatch = function (arg1, arg2) {
		var obj;
		if (typeof arg1 === 'string') {
			obj = {};
			obj['_REDUX2_ACTION_NAME_'] = arg1;
			obj.data = arg2;
			return dispatch.call(this, obj || arg1);
		}
		return dispatch.call(this, obj || arg1);
	}
}

function redux2Middleware() {
	return redux2Middleware_(info.actionFuncs, info.func2MName);
}

function process(conf) {

	let[ reducers, actionFuncs, func2MName] = [{}, {}, {}];



	for (let i = 0; i < conf.length; i++) {
		let req = conf[i];

		req.keys().forEach(function (name) {

			let modelName = name.replace(/.*?\/([a-zA-Z0-9_\$]+?)\.js/, function (item, $1) {
				return $1;
			});
			//get exported default value
			let model = req(name);

			//enforce defaulting, should not be undefined
			if (!model || model.constructor !== Object ||!model['default']||model['default'].constructor !== Object) {
				throw  `the model file ${name} should had a default data of Object` ;
			}

			//make the reducer function
			reducers[modelName] = (function (name, modelName, model) {
				return function reducer(state, actionResult) {
					// Init store with default state
					if (typeof state === 'undefined') {
						return Object.assign({}, model['default']);
					// Update store by actionResult
					} else {
						if (typeof actionResult[modelName] === 'undefined') { //when the actionResult returns nothing
							return state;
						} else {
							return Object.assign({}, state, actionResult[modelName]);
						}
					}
				}
			})(name, modelName, model);

			model = {...model};
			delete model.default;
			Object.keys(model).forEach((item) => {
				if(typeof model[item]!=='function') throw item+" should be a function in a model file";
				if(func2MName[item])  throw "the function "+item+" should be unique in application";
				func2MName[item] = modelName;
			});
			Object.assign(actionFuncs, model);

		});

	}

	return {
		actionFuncs : actionFuncs,
		reducers : reducers,
		func2MName : func2MName
	};
}