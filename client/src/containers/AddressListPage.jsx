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
import AddressList from '../components/membership/AddressList.jsx';
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

class AddressListPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

    }

    this.auth = new Auth(context.store);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps){

  }

  render() {

    const {selectedMember, userData, loading, addresses} = this.props;
    const isLoggedIn = this.auth.isUserAuthenticated();
    const isAdmin = isLoggedIn && this.auth.isUserAdmin();
    const selectedAddress = this.state.selectedAddress;

    return (
      <div className="jumbotron">

        <DataSourceModePanel dataSource={this.props.dataSource}
          onModeCancel={dataSource => this.handleDataSourceModeCancel(dataSource)}
          onModeAccept={dataSource => this.handleDataSourceModeAccept(dataSource)} />

        <div style={{clear:'both', marginTop:'5px'}}></div>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>

              <AddressList addresses={addresses}
                onSelectItem={(address) => this.handleAddressItemSelection(address)}
                selectedAddress={selectedAddress}
                />
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>

              {selectedAddress && (
                <div>
                  You selected address {selectedAddress}
                </div>
              )}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

AddressListPage.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {

  // thanks http://www.jstips.co/en/javascript/deduplicate-an-array/
  function dedup(arr) {
  	var hashTable = {};

  	return arr.filter(function (el) {
      if(!el.street) return false;
  		var key = JSON.stringify(el);
  		var match = Boolean(hashTable[key]);
  		return (match ? false : hashTable[key] = true);
  	});
  }

  const addresses = dedup(state.memberApp.members.map(member => member.propertyAddress)).sort((a,b) => a.street.localeCompare(b.street));

  return {
    addresses: addresses,
    selectedMember: state.memberApp.selectedMember,
    userData: state.userApp.userData,
    loading: state.memberApp.loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressListPage);
