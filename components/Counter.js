import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as CounterActions from '../actions/counter'
import ReactDOM from 'react-dom';


@connect(state=>({text:state.text}))
class Btn extends Component {
	static propTypes = {
	  incrementIfOdd: PropTypes.func.isRequired,
	  text:PropTypes.string.isRequired
	}
	
	componentWillReceiveProps(props) {
		console.log('11',props);
	}
	
  render() {
    const { incrementIfOdd, text} = this.props
    return (
      <button onClick={incrementIfOdd}>{text}</button>
    )
  }
}

console.log({f:Btn});

@connect(state=>({counter: {n:state.counter.n}}),dispatch=>bindActionCreators(CounterActions, dispatch))
export default class Counter extends Component {
	static propTypes = {
	  increment: PropTypes.func.isRequired,
	  incrementIfOdd: PropTypes.func.isRequired,
	  incrementAsync: PropTypes.func.isRequired,
	  decrement: PropTypes.func.isRequired,
	  counter: PropTypes.object.isRequired
	}
	
	componentWillReceiveProps(props) {
		
		const el = ReactDOM.findDOMNode(this.refs.btn1);
		console.log('ReactDOM',{el});
		
		
	}
	
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter} = this.props;
    return (
      <p>
        Clicked: {counter.n}  times
        {' '}
        <button ref='btn1' onClick={increment}>+</button>
        {' '}
        <button onClick={decrement}>-</button>
        {' '}
        <Btn incrementIfOdd={incrementIfOdd} />
        {' '}
        <button onClick={() => incrementAsync()}>Increment async</button>
      </p>
    )
  }
}


