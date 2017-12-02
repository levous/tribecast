import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
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
import 'react-notifications/lib/notifications.css';

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      filteredList: props.members,
      editingSelectedMember: false
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
        <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleAddButtonTouchTap()} tooltip='New Member'><IconAdd /></FloatingActionButton>
        <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleExportTouchTap()} tooltip='Export CSV'><IconDownload /></FloatingActionButton>
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
        {isLoggedIn && (<FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleRefreshButtonTouchTap()} tooltip='Refresh from Server'><IconRefresh /></FloatingActionButton> )}
        {adminButtons}

        <div style={{clear:'both', marginTop:'5px'}}></div>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <SearchField
                list={this.props.members}
                keys={weightedSearchKeys}
                placeholder='fuzzy finder'
                style={{width:'100%', border: 'solid 1px rgb(136, 208, 1)', padding: '3px', borderRadius: '5px'}}
                onSearch={filteredList => this.handleSearch(filteredList)} />
              <br/>
              <MemberList members={this.state.filteredList}
                onSelectItem={(member) => this.handleMemberItemSelection(member)}
                selectedMemberId={selectedMemberId}
                suppressAutoScroll={shouldSuppressListAutoScroll}/>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>

              {selectedMember && (

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
