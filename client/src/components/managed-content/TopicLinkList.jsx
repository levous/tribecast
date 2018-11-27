import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import TopicLink from './TopicLink'

const TopicLinkListView = ({topics, onNavigate}) => {
  return (
    <div>
      <h3>Topic Link List View</h3>
      <ul>
        {
          topics.map((topic, i) => (
            <li key={i}>
              <TopicLink topic={topic} onNavigate={onNavigate} />
            </li>
          ))
        }
      </ul>
    </div>

  )
}

TopicLinkListView.propTypes = {
 topics: PropTypes.array,
 selectedTopic: PropTypes.object
}

export default TopicLinkListView
