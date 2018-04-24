import React, {PropTypes, Component} from 'react';
import { List, ListItem } from 'material-ui/List';
import Address from './Address.jsx';

export default class AddressList extends Component {

  handleSelectItem(address) {
    this.props.onSelectItem(address)
  }

  render() {


    return (
      <div style={{
        overflow: 'scroll',
        WebkitOverflowScrolling: 'touch',
        maxHeight: '500px'
      }}>
        <List>
          {
            this.props.addresses.map((address, i) => {
              // sanity check
              if(!address){
                console.log('AddressList:props.address.map', 'address item was null');
                return <ListItem key={`addr${i}`} primaryText='address null' secondaryText='This indicates a problem.  Please contact support.' />
              }

              const memberCount = this.props.memberCountAtAddressArray && this.props.memberCountAtAddressArray[i];
              const memberCountTag = memberCount && <div style={{height: '30px', width: '30px', backgroundColor:'#aaaaaa', color: '#ffffff', borderRadius: '50%', float: 'right', margin: '5px', textAlign: 'center', lineHeight: '30px'}}>{memberCount}</div>


              return (
              <ListItem key={`addr${i}`}
                primaryText={
                  <div>
                    {memberCountTag}
                    <Address address={address} />
                  </div>
                }
                onTouchTap={() => this.handleSelectItem(address)}
              />
            )
            })
          }
        </List>
      </div>
    );
  }

  }

AddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  memberCountAtAddressArray: PropTypes.array,
  onSelectItem: PropTypes.func.isRequired
};
