import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const ContentHeaderView = ({topic}) => {
  if(!topic) return null
  return <h1>{topic.title}</h1>
}


ContentHeaderView.propTypes = {
  topic: PropTypes.object
}

export default ContentHeaderView
