
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/Counter'
import { createStore, applyMiddleware ,combineReducers } from 'redux'

import {redux2,reducerMaker,redux2Middleware} from './redux2'

var reduc=reducerMaker(require.context('./actions', false, /\.js$/));

const createStoreWithMiddleware = applyMiddleware(
  redux2Middleware()
)(createStore)
 
const reducers=combineReducers(reduc);
 

const store = createStoreWithMiddleware(reducers)

redux2(store);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
