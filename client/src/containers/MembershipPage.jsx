import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col, Panel} from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import {NotificationManager} from 'react-notifications';
import PapaParse from 'papaparse';
import MemberList from '../components/membership/MemberList.jsx';
import Member from '../components/membership/Member.jsx';
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
      bulkSearchDialogOpen: false,
      bulkSearchResultsMeta: null
    }

    this.auth = new Auth(context.store);
  }

  componentDidMount() {
    if(this.props.location.query.notification){
      NotificationManager.info(this.props.location.query.notification);
    }

    if(this.props.location.query.clearLocalStorage){
      localStorage.clear();
    }

    if(this.props.location.query.cancelLoading){
      this.props.actions.cancelLoading();
    }

    if(this.props.location.query.refresh){
      this.props.actions.refreshMembersFromServer();
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.members !== this.props.members){
      this.setState({filteredList: nextProps.members});
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
    var csv = PapaParse.unparse(this.state.filteredList);

    var blob = new Blob([csv]);
		var a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob, {type: "text/csv"});
    a.download = "export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      const nameArray = nameString.trim().split(' ');
      if(nameArray.length > 1) {
        return {firstName: nameArray[0].trim(), lastName: nameArray[nameArray.length - 1].trim()};
      } else {
        return {firstName: '', lastName: nameArray[0].trim()};
      }
    };

    const namesText = this.bulkSearchTextField.value  ;
    const names = namesText.split('\n').filter(nameString => nameString.trim().length > 0).map(nameStringToObject);
    let foundNames = [];

    const matches = this.props.members.filter(member => {
      for(let i=0, l=names.length;i < l;i++){
        const name = names[i];

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
    this.props.router.push('/invitations');
  }

  presentDeleteConfirmation(present){
    this.setState({deleteDialogOpen: present, editingSelectedMember: false});
  }

  handleDeleteMember(member) {
    this.props.actions.deleteMember(member);
    this.setState({deleteDialogOpen: false});
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

  render() {

    const {selectedMember, userData, auth, loading} = this.props;
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


    const adminButtons = (!isAdmin && '') || (
      <div style={{display: 'inline'}}>
        <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleAddButtonTouchTap()}><IconAdd /></FloatingActionButton>
        <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleExportTouchTap()}><IconDownload /></FloatingActionButton>
        <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.presentBulkSearch(true)}><IconBulkSearch /></FloatingActionButton>
      </div>
    );


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
            {`${loading}`}
          </div>
        )}
        <DataSourceModePanel dataSource={this.props.dataSource}
          onModeCancel={dataSource => this.handleDataSourceModeCancel(dataSource)}
          onModeAccept={dataSource => this.handleDataSourceModeAccept(dataSource)} />
        {this.state.bulkSearchResultsMeta && (
          <Panel collapsible={true} defaultExpanded={true} header='Bulk Search Results' bsStyle="info">
            <p>Searched for: {this.state.bulkSearchResultsMeta.names.map(name => `${name.firstName} ${name.lastName}`).join(', ')}</p>
            <p>Didn't find: {this.state.bulkSearchResultsMeta.notFoundNames.map(name => `${name.firstName} ${name.lastName}`).join(', ')}</p>
            <RaisedButton style={{marginLeft: '10px'}} primary={true} label="Cancel" onClick={(button) => this.presentBulkSearch(false)} />
          </Panel>
        )}
        {isLoggedIn && (<FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleRefreshButtonTouchTap()}><IconRefresh /></FloatingActionButton> )}
        {adminButtons}

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
                    style={{postion: 'relative'}}
                    onUpdate={(member) => this.handleUpdate(member)}
                    onInvite={(member) => this.handleInvite(member)}
                    onEditing={(editing) => this.handleMemberEditing(editing)}
                    onProfileImageChanged={(thumbnailImage, fullsizeImage, uneditedImage) => this.handleProfileImageChanged(thumbnailImage, fullsizeImage, uneditedImage)}
                  />
                  {isAdmin && this.state.editingSelectedMember && <RaisedButton secondary={true} label="Delete" onClick={(button) => this.presentDeleteConfirmation(true)} />}
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
                    title="Bulk Search"
                    modal={true}
                    open={this.state.bulkSearchDialogOpen}
                    actions={[
                      <RaisedButton primary={true} labelColor='white' label="Search" onClick={(button) => this.executeBulkSearch()} />,
                      <RaisedButton style={{marginLeft: '10px'}} secondary={true} label="Cancel" onClick={(button) => this.presentBulkSearch(false)} />
                    ]}>
                    <p>Paste a list of names to match, one name per line</p>
                    <label>Names</label>
                    <div>
                      <textarea name="bulk-search-text" ref={(el) => { this.bulkSearchTextField = el }} style={{width:'100%'}} rows={10}/>
                    </div>
                  </Dialog>
                </div>
              )}
            </Col>
          </Row>
        </Grid>
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
    loading: state.memberApp.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MembershipPage);
