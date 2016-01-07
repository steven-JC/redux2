import 'babel-polyfill'
import React,{Component} from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware ,combineReducers } from 'redux'
import { ReduxRouter, routerStateReducer, reduxReactRouter} from 'redux-router';
import { Route, IndexRoute, Redirect} from 'react-router';
import {createHistory} from 'history'

import {redux2, reducerMaker, redux2Middleware} from './libs/redux2'


var reduc=reducerMaker([require.context('./models', false, /\.js$/)]);

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
				<Route path="/" component={require('./pages/Home')}/>
			</ReduxRouter>
		</Provider>
		);
	}	
}

ReactDOM.render(<Root/>, document.querySelector('#container'));