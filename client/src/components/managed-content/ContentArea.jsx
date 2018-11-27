import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const ContentAreaView = ({topic, contentTargetKey}) => {
  if(!topic || !Array.isArray(topic.contentAreas)) return null
  const contentArea = topic.contentAreas.find(t => t.targetKey == contentTargetKey)
  const html = contentArea ? contentArea.html : 'UH OH!  Expected content target key not found in provided topic'
  
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}

ContentAreaView.propTypes = {
  topic: PropTypes.object,
  contentTargetKey: PropTypes.string
}

export default ContentAreaView;
