import React, {PropTypes, Component} from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'react-avatar';
import md5 from 'js-md5';
//TODO: convert styles.listStyle to className

export default class MemberList extends Component {
  constructor(props, context) {
    super(props, context);
    const selectedMemberId = props.selectedMemberId || -1;
    this.state = {
      activeItem: selectedMemberId
    }
  }

  handleItemTouchTap(member){
    console.log('handleItemTouchTap', member.id);
    this.setState({activeItem:member.id});
    this.props.onSelectItem(member);
  }

  render() {
    const styles = {
      selectedRow: {
        border: '1px solid #00bcd4'
      },
      listStyle: {
        overflow: 'scroll',
        WebkitOverflowScrolling: 'touch'
      }
    };

    const className = this.state.activeItem ? 'member-list-container squeeze' : 'member-list-container'

    return (
      <div style={styles.listStyle} className={className}>

        <List>
          {
            this.props.members.map((member, i) =>
              <ListItem key={`mem${i}`}
                leftAvatar={
                  <Avatar md5Email={md5(member.email)} name={`${member.firstName} ${member.lastName}`} round={true} size={40} />
                }
                primaryText={`${member.firstName} ${member.lastName}`}
                secondaryText={member.propertyAddress && member.propertyAddress.street}
                onTouchTap={() => this.handleItemTouchTap(member)}
                style={(this.state.activeItem === member.id) ? styles.selectedRow : {}}
              />
            )
          }
        </List>
      </div>
    );
  }

}

MemberList.propTypes = {
  members: PropTypes.array
};
