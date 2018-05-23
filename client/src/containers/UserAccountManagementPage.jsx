import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import {NotificationManager} from 'react-notifications';
import UserList from '../components/account-management/UserList.jsx';
import UserAccount from '../components/account-management/UserAccount.jsx';
import SearchField from '../components/forms/SearchField.jsx';
import * as allActions from '../actions';
import Auth from '../modules/Auth'
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconAdd from 'material-ui/svg-icons/content/add';
import 'react-notifications/lib/notifications.css';

class UserAccountManagementPage extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      filteredList: props.users || [{id: 9, name: "Hello Kitty", email: "hello@kitty.com"}, {id: 10, name: "Groovy Baby", email: "groovy@baby.com"}],
      usersShouldReload: (!props.users || props.users.length === 0)
    }

    this.auth = new Auth(context.store);
  }

  componentDidMount() {
    if(this.state.usersShouldReload){
      this.props.actions.getAllUsers();
      this.setState({usersShouldReload: false});
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.users !== this.props.users){
      this.setState({filteredList: nextProps.users, usersShouldReload: false});
    }
  }

  handleUserItemSelection(userAccount) {
    this.props.actions.selectUserAccount(userAccount);
  }

  handleAddButtonTouchTap() {
    return alert('not implemented yet');

    let temp = {
      name: '$uper',
      email: '_Man',

    };
    this.props.actions.createUserAccount(temp)
    this.props.actions.selectUserAccount(temp);
  }

  handleRefreshButtonTouchTap() {
    this.props.actions.getAllUsers();
  }

  handleToggleRole(user, role) {
    this.props.actions.toggleUserRole(user, role);
  }

  handleSearch(results) {
    //TODO: use options to include score and matches to apply highlighting.  The results will come back in a modified object structure
    // http://fusejs.io/
    this.setState({filteredList: results});
  }
  
  handleViewUserMember(user) {
    const userMember = this.props.members.find(m => m.memberUserKey === user.memberUserKey);
    if(!userMember) return NotificationManager.warning("There was no member found for that user account.  The member record may have been deleted.", "Invalid Member User Key");
    this.props.actions.selectMember(userMember);
    this.props.history.push('/membership');
  } 

  handleUpdate(user) {
    this.props.actions.updateUser(user);
  }

  render() {
    const {selectedUser, currentUserData, auth, loading} = this.props;
    const isLoggedIn = this.auth.isUserAuthenticated();
    const isAdmin = isLoggedIn && this.auth.isUserAdmin();
    const selectedUserId = selectedUser ? selectedUser.id : '';
    const weightedSearchKeys = [{
      name: 'name',
      weight: 0.5
    },{
       name: 'email',
       weight: 0.5
    }];

    return (
      <div className="jumbotron">
        <h1>User Management</h1>
        {loading && (
          <div>
            <Dialog
              title="Fetching from API"
              modal={true}
              open={true} >
              ...loading <CircularProgress />
            </Dialog>
            {`${loading}`}
          </div>
        )}
        {isLoggedIn && (<FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleRefreshButtonTouchTap()}><IconRefresh /></FloatingActionButton> )}
        {isAdmin && ( <FloatingActionButton mini={true} secondary={true} style={{float:'right', margin: '5px'}} onTouchTap={() => this.handleAddButtonTouchTap()}><IconAdd /></FloatingActionButton> )}
        <div style={{clear:'both', marginTop:'5px'}}></div>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>
              <SearchField
                list={this.props.users}
                keys={weightedSearchKeys}
                placeholder='fuzzy finder'
                style={{width:'100%', border: 'solid 1px rgb(136, 208, 1)', padding: '3px', borderRadius: '5px'}}
                onSearch={filteredList => this.handleSearch(filteredList)} />
              <br/>
              <UserList users={this.state.filteredList}
                onSelectItem={(user) => this.handleUserItemSelection(user)}
                selectedUserId={selectedUserId}/>
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>

              {selectedUser && (

                <UserAccount
                  user={selectedUser}
                  style={{postion: 'relative'}}
                  onUpdate={(user) => this.handleUpdate(user)}
                  onToggleRole={(user, role) => this.handleToggleRole(user, role)}
                  onViewUserMember={user => this.handleViewUserMember(user)}
                />
              )}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

UserAccountManagementPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    users: state.userApp.users,
    members: state.memberApp.members,
    selectedUser: state.userApp.selectedUser,
    currentUserData: state.userApp.userData,
    loading: state.userApp.loading

  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(allActions, dispatch)
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserAccountManagementPage));
