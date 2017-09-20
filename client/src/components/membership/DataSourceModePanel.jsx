import React, {PropTypes, Component} from 'react';
import {Grid, Row, Col, Panel, Button} from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
import IconUpload from 'material-ui/svg-icons/file/file-upload';
import IconCancel from 'material-ui/svg-icons/navigation/cancel';
import IconButton from 'material-ui/IconButton';
import IconCake from 'material-ui/svg-icons/social/cake';
import Dialog from 'material-ui/Dialog';
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

  render(){
      switch (this.props.dataSource) {
        case member_data_sources.SEED:
          return (
            <div>
              <Panel collapsible expanded={this.state.open} header='Preview Mode' bsStyle="info">
                You are viewing preview content.  An administrator can authorize your account to load {communityDefaults.name}
              </Panel>
            </div>
          );

        case member_data_sources.CSV_IMPORT:
          return (
            <div style={{marginBottom:'-15px'}}>
              <Panel collapsible data-toggle='collapse' expanded={this.state.open}
                header='CSV Import Preview Mode'
                bsStyle="warning">
                You are viewing a preview of your import.  Please review and publish to {communityDefaults.name} or cancel.
                <table cellPadding={10}>
                  <caption>legend</caption>
                  <tbody>
                    <tr><td style={{backgroundColor:'#daf1d0'}}>new member</td><td rowSpan='3' style={{padding:'10px', fontSize:'0.7em'}}>
                      New members will be added.  Confidently matched records already exist and will be updated.  Possible matches might result in duplicates.
                      <br/>
                      <IconButton onTouchTap={this.toggleDevNote}>
                        <IconCake />
                      </IconButton>
                    </td></tr>
                  <tr><td style={{backgroundColor:'#cdecf0', width: '150px'}}>confident match</td></tr>
                    <tr><td style={{backgroundColor:'#fcf8e3'}}>possible match</td></tr>
                  </tbody>
                </table>


                <Dialog
                  title="Imported Record Match Proof"
                  actions={<FlatButton label="OK" secondary={true} onTouchTap={this.toggleDevNote}/>}
                  modal={true}
                  open={this.state.devNoteOpen} >
                  This feature intentionally left incomplete.  If more capability is needed for reconciling mismatched imported records, development will need to be scheduled.  <small>I wanted to make it super-awesome but other features beckoned</small>
                </Dialog>
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
