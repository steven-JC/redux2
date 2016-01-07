import React,{ Component, PropTypes } from 'react'
import { connect } from 'react-redux'

@connect(state=>({counter: {n: state.counter.n}}))
export default class Counter extends Component {
    sum() {
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


