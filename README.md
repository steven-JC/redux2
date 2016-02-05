Redux2
========
Write less, more specific, the react application architectural toolkit, which is based on redux.

[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![Windows Tests][windows-image]][windows-url]

> Redux2 is the official successor to optimist. Please feel free to submit issues and pull requests. If you'd like to contribute and don't know where to start, have a look at [the issue list](https://github.com/stevenCJC/redux2/issues) :)

### Getting started 

````javascript
npm install redux2 --save
````


examples
========


### your index file of your application should be like this:
app.js:
-------------------------------------------------------------------

````javascript
import 'babel-polyfill'
import React,{Component} from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware ,combineReducers } from 'redux'
import { ReduxRouter, routerStateReducer, reduxReactRouter} from 'redux-router';
import { Route, IndexRoute, Redirect} from 'react-router';
import {createHistory} from 'history'

import {redux2, reducerMaker, redux2Middleware} from 'redux2'

// use the function "require.context" of webpack to collect all of actions
// by 'reducerMaker', it will automatically generate all the related reducers
var reducers_=reducerMaker([require.context('./actions', false, /\.js$/)]);

const reducers=combineReducers({...reducers_, router: routerStateReducer});

const store = compose(
	applyMiddleware( redux2Middleware()),
	reduxReactRouter({createHistory})
)(createStore)(reducers);

redux2(store);

class Root extends Component {
	render(){return (
		<Provider store={store}>
			<ReduxRouter>
				<Route path="/" component={require('./page/Home')}/>
			</ReduxRouter>
		</Provider>
		);
	}
}

ReactDOM.render(<Root/>, document.querySelector('#container'));
````



>To implement business requirement, you need one action file and one UI compenent file with redux2.
>the extention '.js' of action file name is recommended, as the extention '.jsx' of UI compenent filename is recommended

actions.js  
-------------------------------------------------------------------

````javascript

// when the application init, it would be set to store as default state of current action file,
// and it should be an plain object
export default {n:0};


// the function name should be unique in your application,
// as it would be called by other action in different files or UI compenents, 
// and even by 'require('redux2').dispatch'
export function sum() {
	return async (dispatch, getState) => {

		// "getState" would get the state maintained by current file with no parameter
		// passing an action file name without extention as parameter will get the state maintained by other action files.
		// const {m}= getState('otherActionFileName');
		const {n}= getState();

		// passing a string as the first parameter to dispatch, it will call another action function in your application
		// the second parameter would be passed to the action function as argument.
		// in async action function, you can get the result returned by the dispatched action with "await"
		var r=await dispatch('asyncGet', {n:33});
		var rr=await dispatch('normalGet');
		var rrr=await dispatch('get');
		var rrrr=await dispatch('getByAsyncGet');

        	// the returned object will update the state of current file and also automaticaly reflected in UI compenent
		return {
			n: n + r.n + rr.n + rrr.n + rrrr.n
		};
	}
}

export function asyncGet(options) {
	return async (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			setTimeout(() => { resolve({n:options.n}); }, 1000);
		});
	}
}
export function normalGet() {
	return (dispatch, getState) => {
	    let {m}=getState('otherActionFileName');
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

````


Home.jsx
-------------------------------------------------------------------
````javascript
import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

@connect(state=>({counter: {n: state.counter.n}}))
export default class Counter extends Component {
    sum() {
        // you can pass the second parameter as an argument to the dispatched action if you need
        // this.props.dispatch('sum',options);
        this.props.dispatch('sum');
    }

    render() {
        const {  counter} = this.props;
        return (
            <p>
                Result is here: {counter.n}
                {' '}
                <button onClick={this.sum.bind(this)}>Sum</button>
            </p>

        )
    }
}

````

You can also dispatch an action by the method 'require('redux2').dispatch'.

````javascript

var dispatch = require('redux2').dispatch;
window.onload=function(){
	dispatch('hello',{'msg':'world'});
};

````




[travis-url]: https://travis-ci.org/bcoe/yargs
[travis-image]: https://img.shields.io/travis/bcoe/yargs.svg
[gemnasium-url]: https://gemnasium.com/bcoe/yargs
[gemnasium-image]: https://img.shields.io/gemnasium/bcoe/yargs.svg
[coveralls-url]: https://coveralls.io/github/bcoe/yargs
[coveralls-image]: https://img.shields.io/coveralls/bcoe/yargs.svg
[npm-url]: https://www.npmjs.com/package/yargs
[npm-image]: https://img.shields.io/npm/v/yargs.svg
[windows-url]: https://ci.appveyor.com/project/bcoe/yargs
[windows-image]: https://img.shields.io/appveyor/ci/bcoe/yargs/master.svg?label=Windows%20Tests
