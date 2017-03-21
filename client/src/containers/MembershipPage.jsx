import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap'
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import {NotificationManager} from 'react-notifications';
import MemberList from '../components/membership/MemberList.jsx';
import Member from '../components/membership/Member.jsx';
import DataSourceModePanel from '../components/membership/DataSourceModePanel.jsx';
import SearchField from '../components/forms/SearchField.jsx';
import * as memberActions from '../actions/member-actions';
import Auth from '../modules/Auth'
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import 'react-notifications/lib/notifications.css';

class MembershipPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      filteredList: props.members,
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
    this.props.actions.selectMember(member);
  }

  handleUpdate(member){
    this.props.actions.updateMember(member);
  }

  handleAddButtonTouchTap() {
    let temp = {
      id: Math.floor(Date.now() / 1000),
      firstName: '$$$$$$$$$$$$$Super',
      lastName: 'Man',
      propertyAddress: {
        street: '99 Serenbe Ln',
        city : 'Palmetto',
        state: 'GA',
        zip  :  '30268'
      }
    };

    this.props.actions.addMember(temp);
  }

  handleRefreshButtonTouchTap() {
    this.props.actions.refreshMembersFromServer();
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
    const importNote = `${this.props.userData.name} published import - ${this.props.importNote}`;
    this.props.actions.publishMembers(this.props.members, importNote);
  }

  handleDataSourceModeCancel(dataSource){
    this.handleRefreshButtonTouchTap();
  }

  render() {
    const {selectedMember, userData, auth, loading} = this.props;
    const isLoggedIn = this.auth.isUserAuthenticated();
    const isAdmin = isLoggedIn && this.auth.isUserAdmin();
    const selectedMemberId = selectedMember ? selectedMember.id : -1;
    const canEditSelectedMember = isAdmin || isLoggedIn && this.auth.userCanEditMember(userData, selectedMember);
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

    return (
      <div className="jumbotron">
        {loading && (
          <div>
            Hello
            <Dialog
              title="Fetching from API"
              modal={true}
              open={true} >
              ...loading <CircularProgress />
            </Dialog>
            {`${loading}`}
          </div>
        )}
        <DataSourceModePanel dataSource={this.props.dataSource}
          onModeCancel={dataSource => this.handleDataSourceModeCancel(dataSource)}
          onModeAccept={dataSource => this.handleDataSourceModeAccept(dataSource)} />
          {isLoggedIn && (<FlatButton primary={false} label='' style={{float:'right'}} icon={<IconRefresh />} onTouchTap={() => this.handleRefreshButtonTouchTap()} />)}
          {isAdmin && (<FlatButton primary={true} label='+' style={{float:'right'}} onTouchTap={() => this.handleAddButtonTouchTap()} />)}

        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <SearchField
                list={this.props.members}
                keys={weightedSearchKeys}
                placeholder='fuzzy finder'
                style={{width:'100%', border: 'solid 1px rgb(0, 188, 212)', padding: '3px', borderRadius: '5px'}}
                onSearch={filteredList => this.handleSearch(filteredList)} />
              <br/>
              <MemberList members={this.state.filteredList}
                onSelectItem={(member) => this.handleMemberItemSelection(member)}
                selectedMemberId={selectedMemberId}/>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>
              {selectedMember && (
                <Member key={`memberdiv${selectedMember.id}`}
                  member={selectedMember}
                  canEdit={canEditSelectedMember}
                  style={{postion: 'relative'}}
                  onUpdate={(member) => this.handleUpdate(member)}
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
