import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import QS from 'qs';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import {NotificationManager} from 'react-notifications';
import PapaParse from 'papaparse';
import MemberList from '../components/membership/MemberList.jsx';
import Member from '../components/membership/Member.jsx';
import NavigationButton from '../components/NavigationButton';
import DataSourceModePanel from '../components/membership/DataSourceModePanel.jsx';
import SearchField from '../components/forms/SearchField.jsx';
import * as memberActions from '../actions/member-actions';
import Auth from '../modules/Auth'
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconDownload from 'material-ui/svg-icons/file/file-download';
import IconBulkSearch from 'material-ui/svg-icons/social/group';
import 'react-notifications/lib/notifications.css';

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      filteredList: props.members,
      editingSelectedMember: false,
      deleteDialogOpen: false,
      resetUserAccountDialogOpen: false,
      bulkSearchDialogOpen: false,
      bulkSearchMode: 'names',
      bulkSearchResultsMeta: null,
      showInvitationsLink: false
    }

    this.auth = new Auth(context.store);
  }

  componentDidMount() {
    const qs = QS.parse(this.props.location.search);
    if(qs.notification){
      NotificationManager.info(qs.notification);
    }

    if(qs.clearLocalStorage){
      localStorage.clear();
    }

    if(qs.cancelLoading){
      this.props.actions.cancelLoading();
    }

    if(qs.refresh){
      this.props.actions.refreshMembersFromServer();
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.members !== this.props.members){
      this.setState({filteredList: nextProps.members});
    }
  }

  componentDidUpdate() {

    if(this.props.csvMemberDownload) {
      this.downloadMemberCsvMemberList(this.props.csvMemberDownload);
    }
  }

  handleMemberItemSelection(member) {
    this.setState({editingSelectedMember: false});
    this.props.actions.selectMember(member);
  }

  handleUpdate(member){
    this.props.actions.updateMember(member);
  }

  handleAddButtonTouchTap() {
    let temp = {
      id: Math.floor(Date.now() / 1000),
      firstName: '$uper',
      lastName: '_Man',
      propertyAddress: {
        street: '99 Serenbe Ln',
        city : 'Palmetto',
        state: 'GA',
        zip  :  '30268'
      }
    };
    this.props.actions.addMember(temp)
    this.props.actions.selectMember(temp);
  }

  handleRefreshButtonTouchTap() {
    this.props.actions.refreshMembersFromServer();
  }

  handleExportTouchTap() {
    this.props.actions.generateCsvFromMemberlist(this.state.filteredList);
  }

  downloadMemberCsvMemberList(csv) {

    // this happens when the file is passed as a prop
    var blob = new Blob([csv]);
		var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, {type: "text/csv"});
    a.download = "export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.props.actions.csvFromMemberlistDownloaded();
  }

  presentBulkSearch(present) {
      const bulkSearchResultsMeta = present ? this.state.bulkSearchResultsMeta : null;
      // filtered list should be reset when hiding the bulk search
      const filteredList = present ? this.state.filteredList : this.props.members;
      this.setState({
        bulkSearchDialogOpen: present,
        editingSelectedMember: false,
        bulkSearchResultsMeta: bulkSearchResultsMeta,
        filteredList: filteredList
      });
  }

  executeBulkSearch() {
    const nameStringToObject = (nameString) => {
      // nameString can be 'Jack Johnson' or 'Johnson'.  Obviously, if a first or last name includes spaces, SOL
      const nameArray = nameString.split(/(\s+)/).filter(s => s.trim().length > 0);
      if(nameArray.length > 1) {
        return {firstName: nameArray[0].trim(), lastName: nameArray[nameArray.length - 1].trim()};
      } else {
        return {firstName: '', lastName: nameArray[0].trim()};
      }
    };

    const namesText = this.bulkSearchTextField.value;
    const names = namesText.split('\n').filter(nameString => nameString.trim().length > 0).map(nameStringToObject);
    let foundNames = [];


    const matches = this.props.members.filter(member => {
      for(let i=0, l=names.length;i < l;i++){
        const name = names[i];
        //HACK: unhappy with this but tired and lazy
        //FIXME: Refactor this hack
        if(member.email && this.state.bulkSearchMode === 'emails' && name.lastName.toLowerCase() === member.email.toLowerCase()) {
          foundNames.push(name);
          return true;
        }

        if (name.lastName.toLowerCase() === member.lastName.toLowerCase()) {
          if(name.firstName.length === 0 || name.firstName.toLowerCase() === member.firstName.toLowerCase()) {
            foundNames.push(name);
            return true;
          }
        }
      }
      return false;
    });

    const notFoundNames = names.filter(name => !foundNames.includes(name));

    this.setState({
      bulkSearchDialogOpen: false,
      bulkSearchResultsMeta: {
        names: names,
        notFoundNames: notFoundNames
      },
      filteredList: matches,

    });
  }

  handleSearch(results) {
    //TODO: use options to include score and matches to apply highlighting.  The results will come back in a modified object structure
    // http://fusejs.io/
    this.setState({filteredList: results});
  }

  handleDataSourceModeAccept(dataSource) {
    if(this.props.dataSource !== memberActions.member_data_sources.CSV_IMPORT) {
      alert('ERROR: Cannot publish unless it\'s a csv import');
      return;
    }
    const importNote = `${this.auth.loggedInUserName()} published import - ${this.props.importNote}`;
    this.props.actions.publishMembers(this.props.members, importNote);
  }

  handleDataSourceModeCancel(dataSource){
    this.handleRefreshButtonTouchTap();
  }

  handleInvite(member) {
    this.props.actions.inviteMember(member);
    this.setState({showInvitationsLink: true});
  }

  presentDeleteConfirmation(present){
    this.setState({deleteDialogOpen: present, editingSelectedMember: false});
  }

  presentResetUserAccountConfirmation(present){
    this.setState({resetUserAccountDialogOpen: present, editingSelectedMember: false});
  }

  handleDeleteMember(member) {
    this.props.actions.deleteMember(member);
    this.setState({deleteDialogOpen: false});
  }

  handleResetUserAccount(member) {
    this.props.actions.resetMemberUserAccount(member);
    this.setState({resetUserAccountDialogOpen: false});
  }
  

  handleProfileImageChanged(thumbnailImage, fullsizeImage, unEditedImage){
    this.props.actions.updateMemberProfileImage(this.props.selectedMember, thumbnailImage, fullsizeImage, unEditedImage);
  }

  handleCancelLoading(button) {
    this.props.actions.cancelLoading();
  }

  handleMemberEditing(editing) {
    this.setState({editingSelectedMember: editing});
  }

  handleNextMatchType(recordImportMatchType) {
    //const filteredList = this.props.members.filter(member => member.)
    const indexOfSelected = this.props.members.findIndex(member => member.id === this.props.selectedMember.id);
    const nextMatch = null;

    console.log('selected mem', this.props.selectedMember);

    console.log('selected id', this.props.selectedMember.id);

    console.log('selectedIndex', indexOfSelected);
    // search from selected to end
    for (let i = indexOfSelected + 1; i < this.props.members.length; i++) {
      if(MemberList.memberMatchType(this.props.members[i]) === recordImportMatchType) return this.props.actions.selectMember(this.props.members[i]);
    }

    console.log('didnt find', indexOfSelected);
    // search from beginning to selected
    for (let i = 0; i < indexOfSelected; i++) {
      if(MemberList.memberMatchType(this.props.members[i]) === recordImportMatchType) return this.props.actions.selectMember(this.props.members[i]);
    }

    // reached here?  There are none
    NotificationManager.info('There are no imported records with that match type');
  }

  handleUnLinkApiMatch(member) {
    this.props.actions.unlinkImportedMemberFromApiMatch(member);
  }

  render() {

    const {selectedMember, userData, loading} = this.props;
    const bulk_search_modes = ['names', 'emails'];
    const isLoggedIn = this.auth.isUserAuthenticated();
    const isAdmin = isLoggedIn && this.auth.isUserAdmin();
    const selectedMemberId = selectedMember ? selectedMember.id : -1;
    const canEditSelectedMember = isAdmin || isLoggedIn && this.auth.userCanEditMember(userData, selectedMember);
    const shouldSuppressListAutoScroll = this.state.editingSelectedMember;
    const weightedSearchKeys = [{
      name: 'lastName',
      weight: 0.3
    },
    {
      name: 'firstName',
      weight: 0.3
    },
    {
       name: 'propertyAddress.street',
       weight: 0.1
    },
    {
       name: 'neighborhood',
       weight: 0.1
    },
    {
       name: 'email',
       weight: 0.1
    }];

    const csvURL = this.props.csvMemberDownload ? window.URL.createObjectURL(new Blob([this.props.csvMemberDownload]), {type: "text/csv"}) : null;
    let adminButtons = ''
    if(isAdmin){
      adminButtons = (
        <div style={{display: 'inline'}}>
          <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleAddButtonTouchTap()}><IconAdd /></FloatingActionButton>
          <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleExportTouchTap()}><IconDownload /></FloatingActionButton>
          <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.presentBulkSearch(true)}><IconBulkSearch /></FloatingActionButton>
        </div>
      );
    }

    return (
      <div className="jumbotron">
        {loading && (
          <div>
            <Dialog
              title="Fetching from API"
              modal={true}
              open={true}
              actions={[<FlatButton label="Cancel Loading" onClick={(button) => this.handleCancelLoading(button)} />]}
              >
              ...loading <CircularProgress />
            </Dialog>
          </div>
        )}
        <DataSourceModePanel dataSource={this.props.dataSource}
          onModeCancel={dataSource => this.handleDataSourceModeCancel(dataSource)}
          onModeAccept={dataSource => this.handleDataSourceModeAccept(dataSource)}
          onNextMatchType={matchType => this.handleNextMatchType(matchType)} />
        {this.state.bulkSearchResultsMeta && (
          <Panel defaultExpanded bsStyle='info'>
            <Panel.Heading>
              <Panel.Title toggle>
              Bulk Search Results
              </Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <div>
                  <p style={{fontSize: '0.8em'}}>Searched for: {this.state.bulkSearchResultsMeta.names.map(name => `${name.firstName} ${name.lastName}`).join(', ')}</p>
                  <p style={{fontSize: '0.8em'}}>Didn't find: {this.state.bulkSearchResultsMeta.notFoundNames.map(name => `${name.firstName} ${name.lastName}`).join(', ')}</p>
                  <RaisedButton style={{marginLeft: '10px'}} primary={true} label="Cancel" onClick={(button) => this.presentBulkSearch(false)} />
                </div>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        )}

        <NavigationButton to='/address-view' label="Address View"  style={{float:'right', margin: '5px'}} />
        {isLoggedIn && (<FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleRefreshButtonTouchTap()}><IconRefresh /></FloatingActionButton> )}
        {adminButtons}
        {/* This panel is a fail-safe as we're doing some finicky browser tricks to invoke a file download.  The panel will close once the trick invokes.  */}
        {this.props.csvMemberDownload && (
          
          <Panel defaultExpanded={true} header='CSV Export' bsStyle="info">
            <p>
              If the file didn't automatically download, please click here:
              <a href={csvURL} download="export.csv" onClick={() => this.downloadMemberCsvMemberList(this.props.csvMemberDownload) }>Download CSV</a>
            </p>
          </Panel>
         
        )}

        <div style={{clear:'both', marginTop:'5px'}}></div>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              {(!this.state.bulkSearchResultsMeta) && (
                <div>
                  <SearchField
                    list={this.props.members}
                    keys={weightedSearchKeys}
                    placeholder='fuzzy finder'
                    style={{width:'100%', border: 'solid 1px rgb(136, 208, 1)', padding: '3px', borderRadius: '5px'}}
                    onSearch={filteredList => this.handleSearch(filteredList)} />
                </div>
              )}

              <MemberList members={this.state.filteredList}
                onSelectItem={(member) => this.handleMemberItemSelection(member)}
                selectedMemberId={selectedMemberId}
                suppressAutoScroll={shouldSuppressListAutoScroll}/>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>
              {selectedMember && (
                <div>
                  <Member key={`memberdiv${selectedMember.id}`}
                    member={selectedMember}
                    editing={this.state.editingSelectedMember}
                    canEdit={canEditSelectedMember}
                    canInvite={isAdmin}
                    dataSource={this.props.dataSource}
                    style={{postion: 'relative'}}
                    onUpdate={(member) => this.handleUpdate(member)}
                    onInvite={(member) => this.handleInvite(member)}
                    onEditing={(editing) => this.handleMemberEditing(editing)}
                    onProfileImageChanged={(thumbnailImage, fullsizeImage, uneditedImage) => this.handleProfileImageChanged(thumbnailImage, fullsizeImage, uneditedImage)}
                    onUnLinkApiMatch={(member) => this.handleUnLinkApiMatch(member) }
                  />
                  {isAdmin && this.state.editingSelectedMember && (
                    <div>
                      <RaisedButton secondary={true} label="Delete" onClick={(button) => this.presentDeleteConfirmation(true)} style={{marginRight: '5px'}} />
                      <RaisedButton secondary={true} label="Reset User Account" onClick={(button) => this.presentResetUserAccountConfirmation(true)} />
                    </div>
                  )}
                  <Dialog
                    title={`DELETE ${selectedMember.firstName} ${selectedMember.lastName}?`}
                    modal={true}
                    open={this.state.deleteDialogOpen}
                    actions={[
                      <RaisedButton backgroundColor='red' labelColor='white' label="Confirm DELETE" onClick={(button) => this.handleDeleteMember(selectedMember)} />,
                      <RaisedButton style={{marginLeft: '10px'}} primary={true} label="Cancel" onClick={(button) => this.presentDeleteConfirmation(false)} />
                    ]}>
                    Are you sure you want to DELETE {selectedMember.firstName} {selectedMember.lastName}?
                  </Dialog>

                  <Dialog
                    title={`RESET ACCOUNT for ${selectedMember.firstName} ${selectedMember.lastName}?`}
                    modal={true}
                    open={this.state.resetUserAccountDialogOpen}
                    actions={[
                      <RaisedButton backgroundColor='red' labelColor='white' label="Confirm RESET" onClick={(button) => this.handleResetUserAccount(selectedMember)} />,
                      <RaisedButton style={{marginLeft: '10px'}} primary={true} label="Cancel" onClick={(button) => this.presentResetUserAccountConfirmation(false)} />
                    ]}>
                    Are you sure you want to RESET the USER ACCOUNT for {selectedMember.firstName} {selectedMember.lastName}?
                    <div style={{fontSize: '0.7em'}}>This will remove and archive their current login information and history.  You can then reinvite this member.</div>
                  </Dialog>
                </div>
              )}
              <Dialog
                title={(
                  <div>
                    <span>Bulk Search</span>
                      <SelectField
                        style={{float:'right', margin: '5px'}}
                        floatingLabelText="Search On"
                        value={this.state.bulkSearchMode}
                        onChange={(event, index, value) => this.setState({bulkSearchMode: value})}
                        >
                        { bulk_search_modes.map((mode) => (
                            <MenuItem
                              key={mode}
                              insetChildren={true}
                              value={mode}
                              primaryText={mode}
                            />
                        ))}
                      </SelectField>
                      <div style={{clear: 'both'}} />
                  </div>
                )}
                modal={true}
                open={this.state.bulkSearchDialogOpen}
                actions={[
                  <RaisedButton primary={true} labelColor='white' label="Search" onClick={(button) => this.executeBulkSearch()} />,
                  <RaisedButton style={{marginLeft: '10px'}} secondary={true} label="Cancel" onClick={(button) => this.presentBulkSearch(false)} />
                ]}>
                <p>Paste a list of {this.state.bulkSearchMode} to match, one per line</p>
                <label>{this.state.bulkSearchMode}</label>
                <div>
                  <textarea name="bulk-search-text" ref={(el) => { this.bulkSearchTextField = el }} style={{width:'100%'}} rows={10}/>
                </div>
              </Dialog>
            </Col>
          </Row>
        </Grid>

        <Dialog
          title="Invitations Sent"
          modal={true}
          open={this.state.showInvitationsLink}
          actions={[<FlatButton label="OK" onClick={(button) => this.setState({showInvitationsLink: false})} />]}
          >
          <p>Invitations were sent via email. It may take a few minutes for email to arrive.  Click the link below to preview what was sent. </p>
          <a href='/invitations'>View Invitations</a>
        </Dialog>

      </div>
    );
  }
}

MembershipPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    members: state.memberApp.members,
    selectedMember: state.memberApp.selectedMember,
    dataSource: state.memberApp.dataSource,
    importNote: state.memberApp.importNote,
    userData: state.userApp.userData,
    loading: state.memberApp.loading,
    csvMemberDownload: state.memberApp.csv_member_download
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MembershipPage);
