import React, {PropTypes, Component} from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
import IconUpload from 'material-ui/svg-icons/file/file-upload';
import IconCancel from 'material-ui/svg-icons/navigation/cancel';
import {member_data_sources} from '../../actions/member-actions';
import communityDefaults from '../../../../config/community-defaults';

export default class Member extends Component {

  propTypes: {
    dataSource: PropTypes.string.required,
    onModeAccept: PropTypes.func.required,
    onModeCancel: PropTypes.func.required
  }

  defaultProps: {
    dataSource: member_data_sources.API
  }

  constructor(...args) {
    super(...args);
    this.state = {};
  }

  handlePublishTouchTap(e){
    this.props.onModeAccept(this.props.dataSource);
  }
  handleCancelTouchTap(e){
    this.props.onModeCancel(this.props.dataSource);
  }

  render(){
      switch (this.props.dataSource) {
        case member_data_sources.SEED:
          return (
            <div>
              <Panel collapsible expanded={this.state.open} header='Preview Mode' bsStyle="info">
                You are viewing preview content.  Please log in to load {communityDefaults.name}
              </Panel>
            </div>
          );

        case member_data_sources.CSV_IMPORT:
          return (
            <div style={{marginBottom:'-15px'}}>
              <Panel collapsible data-toggle="collapse" expanded={this.state.open}
                header='CSV Import Preview Mode'
                bsStyle="warning">
                You are viewing a preview of your import.  Please review and publish to {communityDefaults.name} or cancel.
                <FlatButton
                  onTouchTap={() => this.handleCancelTouchTap(member_data_sources.CSV_IMPORT)}
                  label="Cancel"
                  secondary={true}
                  style={{float:'right'}}
                  icon={<IconCancel />}
                  />
                <FlatButton
                  onTouchTap={() => this.handlePublishTouchTap(member_data_sources.CSV_IMPORT)}
                  label="Publish"
                  primary={true}
                  style={{float:'right'}}
                  icon={<IconUpload />}
                  />

              </Panel>
            </div>
          );

        default:
          return null;

      }
    }
  }
