import React, {PropTypes, Component} from 'react';
import { List, ListItem } from 'material-ui/List';

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
        maxHeight: 320,
        overflow: 'scroll'
      }
    };

    return (
      <div style={styles.listStyle}>
        <List>
          {
            this.props.members.map((member, i) =>
              <ListItem key={`mem${i}`}
                primaryText={member.fullName}
                secondaryText={member.propertyAddress.street}
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
