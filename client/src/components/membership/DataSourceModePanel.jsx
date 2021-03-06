import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconUpload from 'material-ui/svg-icons/file/file-upload';
import IconCancel from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import IconForward from 'material-ui/svg-icons/content/forward';
import IconCake from 'material-ui/svg-icons/social/cake';
import Dialog from 'material-ui/Dialog';
import {member_data_sources} from '../../actions/member-actions';
import communityDefaults from '../../../../config/community-defaults';
import MemberList from './MemberList'; // only to use statics

export default class DataSourceModePanel extends Component {

  propTypes: {
    dataSource: PropTypes.string.required,
    onModeAccept: PropTypes.func.required,
    onModeCancel: PropTypes.func.required,
    onNextMatchType: PropTypes.func.required
  }

  defaultProps: {
    dataSource: member_data_sources.API
  }

  constructor(...args) {
    super(...args);
    this.state = {devNoteOpen: false};
  }

  toggleDevNote = () => {
    this.setState({devNoteOpen: !this.state.devNoteOpen});
  };

  handlePublishTouchTap(e){
    this.props.onModeAccept(this.props.dataSource);
  }
  handleCancelTouchTap(e){
    this.props.onModeCancel(this.props.dataSource);
  }

  handleNextMatchTypeTapped(recordImportMatchType) {
    this.props.onNextMatchType(recordImportMatchType);
  }



  render(){
      switch (this.props.dataSource) {
        case member_data_sources.SEED:
          return (
            <div>
              <Panel defaultExpanded bsStyle="info">
                <Panel.Heading>
                  <Panel.Title toggle>
                    Preview Mode
                  </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                  <Panel.Body>
                    You are viewing preview content.  An administrator can authorize your account to load {communityDefaults.name}
                  </Panel.Body>
                </Panel.Collapse>
              </Panel>
            </div>
          );

        case member_data_sources.CSV_IMPORT:
          return (
            <div style={{marginBottom:'-15px'}}>
              <Panel defaultExpanded bsStyle="warning">
                <Panel.Heading>
                  <Panel.Title toggle>
                    CSV Import Preview Mode
                  </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                  <Panel.Body>
              
                    You are viewing a preview of your import.  Please review and publish to {communityDefaults.name} or cancel.
                    <table cellPadding={10} style={{fontSize: '0.7em', fontWeight: 'bold'}}>
                      <caption>legend</caption>
                      <tbody>
                        <tr>
                          <td style={{backgroundColor:'#daf1d0'}}>new member</td>
                          <td><FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onClick={() => this.handleNextMatchTypeTapped(MemberList.recordImportMatchType.notMatched)}><IconForward /></FloatingActionButton></td>
                          <td rowSpan='4' style={{padding:'10px', fontSize:'0.7em'}}>
                          New members will be added.  Confidently matched records already exist and will be updated.  Possible matches could result in unintended overwrite.
                          <br/>
                          <IconButton onClick={this.toggleDevNote}>
                            <IconCake />
                          </IconButton>
                          </td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#cdecf0', width: '170px'}}>confident match</td>
                          <td><FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onClick={() => this.handleNextMatchTypeTapped(MemberList.recordImportMatchType.confidentlyMatchedRecord)}><IconForward /></FloatingActionButton></td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#fcf8e3'}}>possible match</td>
                            <td><FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onClick={() => this.handleNextMatchTypeTapped(MemberList.recordImportMatchType.questionablyMatchedRecord)}><IconForward /></FloatingActionButton></td>
                        </tr>
                        <tr>
                          <td style={{backgroundColor:'#ffdddd'}}>failed validation, bad record</td>
                          <td><FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onClick={() => this.handleNextMatchTypeTapped(MemberList.recordImportMatchType.invalid)}><IconForward /></FloatingActionButton></td>
                        </tr>
                      </tbody>
                    </table>


                    <Dialog
                      title="Imported Record Match Proof"
                      actions={<FlatButton label="OK" secondary={true} onClick={this.toggleDevNote}/>}
                      modal={true}
                      open={this.state.devNoteOpen} >
                      This feature intentionally left incomplete.  If more capability is needed for reconciling mismatched imported records, development will need to be scheduled.  <small>I wanted to make it super-awesome but other features beckoned</small>
                    </Dialog>
                    <FlatButton
                      onClick={() => this.handleCancelTouchTap(member_data_sources.CSV_IMPORT)}
                      label="Cancel"
                      secondary={true}
                      style={{float:'right'}}
                      icon={<IconCancel />}
                      />
                    <FlatButton
                      onClick={() => this.handlePublishTouchTap(member_data_sources.CSV_IMPORT)}
                      label="Publish"
                      primary={true}
                      style={{float:'right', marginLeft: '20px'}}
                      icon={<IconUpload />}
                      />
                    </Panel.Body>
                  </Panel.Collapse>
              </Panel>
             
            </div>
          );

        default:
          return null;

      }
    }
  }
