'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

exports.__esModule = true;
exports['redux2'] = redux2;
exports['dispatch'] = dispatch;
exports['reducerMaker'] = reducerMaker;
exports['redux2Middleware'] = redux2Middleware;

var info = null,
    localDispatch; 

function redux2Middleware(actionFuncs, func2MName) {
	var actionFuncs=info.actionFuncs;
	var func2MName=info.func2MName;
	return function (_ref) {
		var action = undefined;
		var getState = _ref.getState;
		return function (next) {
			return function (action) {
				//console.log(arguments);
				var actionName = undefined,
				    modelName = undefined,
				    arg = action;

				if ((typeof action === 'undefined' ? 'undefined' : _typeof(action)) === 'object') {
					if (action['_REDUX2_ACTION_NAME_']) {

						actionName = action['_REDUX2_ACTION_NAME_'];
						modelName = func2MName[actionName];

						if (!actionFuncs[actionName]) throw 'please make sure the function ' + actionName + ' exist.';

						action = actionFuncs[actionName](action.data);
					} else {
						//other action pass directly
						return next(action);
					}
				}

				if (typeof action === 'undefined') return;

				if (typeof action === 'function') {
					var _ret = (function () {

						var dispatch__ = function dispatch__() {
							var args = arguments;
							if (typeof args[0] === 'string') {
								return (function () {
									var _this = this;

									var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(args0, args1) {
										var modelName, action, result, meta;
										return regeneratorRuntime.wrap(function _callee$(_context) {
											while (1) {
												switch (_context.prev = _context.next) {
													case 0:
														modelName = func2MName[args0];

														if (modelName) {
															_context.next = 4;
															break;
														}

														throw "the state with " + args0 + " is not found, please make sure the function " + args0 + " is exist";

													case 4:
														action = actionFuncs[args0](args1);

														if (!(typeof action === 'function')) {
															_context.next = 19;
															break;
														}

														_context.prev = 6;
														_context.next = 9;
														return action(dispatch__, getState__(modelName));

													case 9:
														result = _context.sent;
														_context.next = 17;
														break;

													case 12:
														_context.prev = 12;
														_context.t0 = _context['catch'](6);
														meta = { meta: {
																action: args0,
																data: args1,
																model: modelName,
																error: _context.t0
															} };

														next(_defineProperty({
															type: Symbol()
														}, modelName, meta));
														console.error(meta.meta);

													case 17:
														_context.next = 20;
														break;

													case 19:
														result = action;

													case 20:
														if (!result) {
															_context.next = 27;
															break;
														}

														if (!(result.constructor !== Object)) {
															_context.next = 25;
															break;
														}

														return _context.abrupt('return', result);

													case 25:
														next(_defineProperty({
															type: Symbol()
														}, modelName, _extends({}, result, { meta: {
																action: actionName,
																state: modelName
															} })));
														return _context.abrupt('return', _extends({}, result));

													case 27:
														return _context.abrupt('return', result);

													case 28:
													case 'end':
														return _context.stop();
												}
											}
										}, _callee, _this, [[6, 12]]);
									}));

									return function (_x, _x2) {
										return ref.apply(this, arguments);
									};
								})()(args[0], args[1]);
							} else {
								return localDispatch(args[0], args[1]);
							}
						};

						var getState__ = function getState__(defaultModel) {
							return function (targetModel) {
								var state = getState()[targetModel || defaultModel];
								if (!state) throw "please check that the model:" + targetModel + ' is exist';
								return _extends({}, state);
							};
						};

						action = action(dispatch__, getState__(modelName)); //必须使用本地方法注入到action中

						if (typeof action === 'undefined') return {
								v: undefined
							};

						if (action.then) {
							// run the root Promise
							action.then(function (data) {

								data = Object.assign({}, data, { meta: {
										action: actionName,
										state: modelName
									} });
								next(_defineProperty({
									type: Symbol()
								}, modelName, data));
							}, function (error) {
								var meta = { meta: {
										action: actionName,
										data: arg,
										model: modelName,
										error: error
									} };
								next(_defineProperty({
									type: Symbol()
								}, modelName, meta));
								console.error(meta.meta);
							});
						} else {
							action = Object.assign({}, action, { meta: {
									action: actionName,
									state: modelName
								} });
							return {
								v: next(_defineProperty({
									type: Symbol()
								}, modelName, action))
							};
						}
					})();

					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
				} else {
					action = Object.assign({}, action, { meta: {
							action: actionName,
							state: modelName
						} });
					return next(_defineProperty({
						type: Symbol()
					}, modelName, action));
				}
			};
		};
	};
}

function reducerMaker(conf) {
	info = process(conf);
	return info.reducers;
}

function redux2(store) {

	var dispatch = store.dispatch;
	var _info = info;
	var actionFuncs = _info.actionFuncs;
	var func2MName = _info.func2MName;

	localDispatch = store.dispatch = function (arg1, arg2) {
		var obj;
		if (typeof arg1 === 'string') {
			obj = {};
			obj['_REDUX2_ACTION_NAME_'] = arg1;
			obj.data = arg2;
			return dispatch.call(this, obj || arg1);
		}
		return dispatch.call(this, obj || arg1);
	};
}

function dispatch(){
	return localDispatch.call(null,arguments[0],arguments[1],arguments[2]);
}

function process(conf) {
	var reducers = {};
	var actionFuncs = {};
	var func2MName = {};

	var _loop = function _loop(i) {
		var req = conf[i];

		req.keys().forEach(function (name) {

			var modelName = name.replace(/.*?\/([a-zA-Z0-9_\$]+?)\.js/, function (item, $1) {
				return $1;
			});
			//get exported default value
			var model = req(name);

			//enforce defaulting, should not be undefined
			if (!model || model.constructor !== Object || !model['default'] || model['default'].constructor !== Object) {
				throw 'the model file ' + name + ' should had a default data of Object';
			}

			//make the reducer function
			reducers[modelName] = (function (name, modelName, model) {
				return function reducer(state, actionResult) {
					// Init store with default state
					if (typeof state === 'undefined') {
						return Object.assign({}, model['default']);
						// Update store by actionResult
					} else {
							if (typeof actionResult[modelName] === 'undefined') {
								//when the actionResult returns nothing
								return state;
							} else {
								return Object.assign({}, state, actionResult[modelName]);
							}
						}
				};
			})(name, modelName, model);

			model = _extends({}, model);
			delete model.default;
			Object.keys(model).forEach(function (item) {
				if (typeof model[item] !== 'function') throw item + " should be a function in a model file";
				if (func2MName[item]) throw "the function " + item + " should be unique in application";
				func2MName[item] = modelName;
			});
			Object.assign(actionFuncs, model);
		});
	};

	for (var i = 0; i < conf.length; i++) {
		_loop(i);
	}

	return {
		actionFuncs: actionFuncs,
		reducers: reducers,
		func2MName: func2MName
	};
}