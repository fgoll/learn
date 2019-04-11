import React, {Component} from 'react'
import ThemeSwitch from "./ThemeSwitch";
import PropTypes from 'prop-types'
import {connect} from './react-redux'

class Content extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  render() {
    return (
      <div>
        <p style={{color: this.props.themeColor}}>React.js 小书内容</p>
        <ThemeSwitch/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

export default connect(mapStateToProps)(Content)
