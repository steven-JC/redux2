Redux2
========

Redux2 be a front-end architecture toolkit, is based on redux & react.

With Redux2, you would have a great programming experience! Write less, more specific.
Your architecture will be more like MV-redux. The redux would more likely to act the mediator and controller, but there is no need to do any coding for this role.

[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![Windows Tests][windows-image]][windows-url]

> Redux2 is the official successor to optimist. Please feel free to submit issues and pull requests. If you'd like to contribute and don't know where to start, have a look at [the issue list](https://github.com/stevenCJC/redux2/issues) :)

examples
========

With Redux2, there is no action and reducer, we use model instead.
When you realizing one special business requirement , you just need a model('.js' is recommended) and a UI compenent('.jsx' is recommended).
The model and react compenent are not direct dependency relationship
-------------------------------------------------------------------
model.js
````javascript

// when the application init, it would be set to store as the default state of current model, and it should be an plan object
// all the following function in this file can just update the state of current model
export default {n:0};

//the function name should be unique in your application, as it would be called by other models or compenents
//if not, it will throw an error tips to you.
export function sum() {
	return async (dispatch, getState) => {

	    //"getState" would get state of current model with no parameter
	    // if you want to get the state of other model, you can pass a model file name without extention name as parameter.
	    // const {m}= getState('otherModelName');
		const {n}= getState();

		//passing a string as the first parameter to dispatch (you can pass the second parameter as the dispatched function argument)
		//it will call another function of model in your application
		//in async function, you can get the result returned by the awaited dispatch function
		//and the result would be reflected in UI compenent preferentially ,if it is used by the UI compenent
		var r=await dispatch('asyncGet', {n:33});
		var rr=await dispatch('normalGet');
		var rrr=await dispatch('get');
		var rrrr=await dispatch('getByAsyncGet');

        //the result will update the state of current model and reflected in UI compenent or get by other function like above
		return {
			n: r.n + rr.n + rrr.n + rrrr.n
		};
	}
}

export function asyncGet(options) {
    //you can use async function instead of callback
	return async (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			setTimeout(() => { resolve({n:options.n}); }, 1000);
		});
	}
}
export function normalGet() {
	return (dispatch, getState) => {
	    //you can get other model state by passing in a parameter of other model file name.
	    let {m}=getState('otherModel');
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

The react compenent with redux almost has nothing change, but the props.dispatch.
You can call a function of model by dispatch a string as the first parameter
-------------------------------------------------------------------
````javascript
import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

@connect(state=>({counter: {n: state.counter.n}}))
export default class Counter extends Component {
    sum() {
        // you can pass the second parameter as options to the function of model if you need
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


With Redux2, you should have this code in your index file of your app, like this:
-------------------------------------------------------------------

app.js:

````javascript
import 'babel-polyfill'
import React,{Component} from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware ,combineReducers } from 'redux'
import { ReduxRouter, routerStateReducer, reduxReactRouter} from 'redux-router';
import { Route, IndexRoute, Redirect} from 'react-router';
import {createHistory} from 'history'

#!// as redux2 is writen with es6 & es7, you need to download redux2.js in any folder of your app.
import {redux2, reducerMaker, redux2Middleware} from './redux2'

#!// your app should be build with webpack, as you need the function require.context to collect all of models
var reduc=reducerMaker([require.context('./actions', false, /\.js$/)]);

const reducers=combineReducers({...reduc, router: routerStateReducer});

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
