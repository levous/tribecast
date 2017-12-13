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


              return (
              <ListItem key={`addr${i}`}
                primaryText={<Address address={address} />}
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
  onSelectItem: PropTypes.func.isRequired
};
