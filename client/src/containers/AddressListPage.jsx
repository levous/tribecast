import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
import MemberList from '../components/membership/MemberList.jsx';
import Address from '../components/membership/Address.jsx';
import Member from '../components/membership/Member.jsx';
import DataSourceModePanel from '../components/membership/DataSourceModePanel.jsx';
import NavigationButton from '../components/NavigationButton';
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

  handleAddressItemSelection(address){
    this.setState({selectedAddress: address, selectedMember: null});
  }

  handleMemberItemSelection(member) {
    this.setState({selectedMember: member});
  }

  render() {

    // thanks http://www.jstips.co/en/javascript/deduplicate-an-array/
    const dedup = (arr) => {
      var hashTable = {};

      return arr.filter(function (el) {
        if(!el.street) return false;

        var key = JSON.stringify(el);
        var match = Boolean(hashTable[key]);
        return (match ? false : hashTable[key] = true);
      });
    };

    const addressesMatch = (address1, address2) => {
      //TODO: use the above hash technique from dedup... var key = JSON.stringify(el);

      return address1 && address2 && address1.street && address2.street &&
        address1.street.toLowerCase()   === address2.street.toLowerCase() &&
        (
          (!address1.street2 && !address2.street2) ||
          (address1.street2.toLowerCase() === address2.street2.toLowerCase())
        ) &&
        address1.city.toLowerCase()     === address2.city.toLowerCase() &&
        address1.state.toLowerCase()    === address2.state.toLowerCase() &&
        address1.zip.toLowerCase()      === address2.zip.toLowerCase()
    };

    const addressSort = (a, b) => {
      const aSplit = a.street.trim().split(' ');
      const bSplit = b.street.trim().split(' ');
      // sort by street name, skipping preceding street number
      return aSplit[1].localeCompare(bSplit[1]) || parseInt(aSplit[0]) - parseInt(bSplit[0]);
    };

    const {userData, loading, members} = this.props;
    const {selectedMember, selectedAddress} = this.state;
    const selectedMemberId = selectedMember ? selectedMember.id : -1;
    const isLoggedIn = this.auth.isUserAuthenticated();
    const isAdmin = isLoggedIn && this.auth.isUserAdmin();
    const addresses = dedup(members.map(member => Object.assign({},member.propertyAddress))).sort(addressSort);


    // this could be done with same pass to dedup but that might get messy.  If performance is acceptable, this is clearer
    // actually, this is weird.  Refactor this to collect a nicely structured state
    const memberAddressHash = members.reduce((hashTable, m) => {
      const memberAddressKey = JSON.stringify(m.propertyAddress);
      if(!hashTable[memberAddressKey]) {
        hashTable[memberAddressKey] = [];
      }
      hashTable[memberAddressKey].push(m);
      return hashTable;
    }, {});

    const memberCountAtAddressArray = addresses.map(address => {
      const addressKey = JSON.stringify(address);
      return memberAddressHash[addressKey] ? memberAddressHash[addressKey].length : 0;
    });

    let membersAtSelectedAddress = [];
    if(selectedAddress){
      membersAtSelectedAddress = members.filter(member => addressesMatch(member.propertyAddress, selectedAddress));
    }




    return (
      <div className="jumbotron">
        <NavigationButton label="Member List View" to ='/membership' style={{float:'right', margin: '5px'}} />
        <DataSourceModePanel dataSource={this.props.dataSource}
          onModeCancel={dataSource => this.handleDataSourceModeCancel(dataSource)}
          onModeAccept={dataSource => this.handleDataSourceModeAccept(dataSource)} />

        <div style={{clear:'both', marginTop:'5px'}}></div>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={4}>

              <AddressList addresses={addresses}
                memberCountAtAddressArray={memberCountAtAddressArray}
                onSelectItem={(address) => this.handleAddressItemSelection(address)}
                selectedAddress={selectedAddress}
                />
            </Col>
            <Col xs={12} md={8} style={{overflow: 'hidden'}}>

              {selectedAddress && (
                <div>
                  You selected address:
                  <Address address={selectedAddress} />
                  there are {membersAtSelectedAddress.length} members there

                  <MemberList
                    members={membersAtSelectedAddress}
                    selectedMemberId={selectedMemberId}
                    onSelectItem={(member) => this.handleMemberItemSelection(member)} />
                  {selectedMember && <Member member={selectedMember} editing={false} canEdit={false} canInvite={false} onEditing={()=>{}} onUpdate={()=>{}} />}
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
  return {
    members: state.memberApp.members,
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
