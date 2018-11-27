import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const TopicLinkView = ({topic, onNavigate}) => {
  let style = {}
  if (topic.selected) {
    style = {fontWeight: 'bold'}
  }
  return <a href={`./${topic.urlSlug}`} onClick={ e => { if(onNavigate) { e.preventDefault(); onNavigate(topic) }}} style={style}>{topic.title}</a>
}

TopicLinkView.propTypes = {
  topic: PropTypes.object.isRequired
}

export default TopicLinkView
