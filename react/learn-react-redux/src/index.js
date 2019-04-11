import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import * as serviceWorker from './serviceWorker';
import Header from './Header';
import Content from './Content';
import { Provider } from './react-redux';

function createStore(reducer) {
  let state = null
  let listeners = []

  const subscribe = (listener) => listeners.push(listener)
  const getState = _ => state
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  dispatch({})
  return {getState, subscribe, dispatch}
}

const themeReducer = (state, action) => {
  if (!state) {
    return {
      themeColor: 'red'
    }
  }

  switch(action.type) {
    case 'CHANGE_COLOR':
      return {...state, themeColor: action.themeColor}
    default:
      return state
  } 
}

const store = createStore(themeReducer)

class Index extends Component {
  
  render() {
    return (
      <div>
        <Header/>
        <Content/>
      </div>
    )
  }
}

ReactDOM.render((
  <Provider store={store}>
    <Index />
  </Provider>), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
