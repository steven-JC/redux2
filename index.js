import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/Counter'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {redux2,redux2Middleware} from './redux2'
import {reducers,actions} from './reducer2'
  
const createStoreWithMiddleware = applyMiddleware(
  redux2Middleware(actions)
)(createStore)
 
function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducers, initialState)
 
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => { 
      const nextReducer = require('./reducers')
      store.replaceReducer(nextReducer)
    })
  }
 
  return store
}

const store = configureStore()

redux2(store);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
