import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'

const NavaigationButton = withRouter(props => {
    const { to, label, style } = props

    return (
    <FlatButton 
        onClick={(button) => { props.history.push(to) }} 
        label={label}
        style={style} />
    )
})

export default NavaigationButton