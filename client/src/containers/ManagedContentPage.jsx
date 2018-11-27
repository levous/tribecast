import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import TopicLinkList from '../components/managed-content/TopicLinkList'
import ContentHeader from '../components/managed-content/ContentHeader'
import ContentArea from '../components/managed-content/ContentArea'


const propTypes = {
  
}

const defaultProps = {}

const ManagedContentPage = ({match, history}) => {

  const topics = [
    {
      title: 'Horses',
      urlSlug: 'horses', 
      contentAreas: [
        {
          targetKey: 'intro',
          html: '<p>A Horse is a Horse of course...</p>'
        },
        {
          targetKey: 'mid-top',
          html: '<p><span style=\'color: blue\'>Top center</span> area content</p>'
        }
      ]
    },
    {title: 'Cows', urlSlug: 'cows'},
    {title: 'Pigs', urlSlug: 'pigs'}
  ]

  const handleTopicNavigation = topic => {
    return history.push(`./${topic.urlSlug}`)
  }

  const topic = match.params.topicSlug ? topics.find(t => t.urlSlug == match.params.topicSlug) : null
  if (topic) topic.selected = true

  return (
    <div className='jumbotron'>
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={4}>
            <div>
              <TopicLinkList topics={topics} onNavigate={handleTopicNavigation} />
              <hr />
              <ContentArea topic={topic} contentTargetKey='intro' />
              <hr />
            </div>
          </Col>
          <Col xs={12} md={8}>
            <ContentHeader topic={topic} />
            <ContentArea topic={topic} contentTargetKey='mid-top' />
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

ManagedContentPage.propTypes = propTypes
ManagedContentPage.defaultProps = defaultProps

export default withRouter(ManagedContentPage)
