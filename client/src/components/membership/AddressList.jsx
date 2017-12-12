import React, {PropTypes, Component} from 'react';
import { List, ListItem } from 'material-ui/List';
import Address from './Address.jsx';

export default class AddressList extends Component {
  render() {


    return (
      <div>

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
                onTouchTap={() => this.handleItemTouchTap(address)}
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
  addresses: PropTypes.array
};
