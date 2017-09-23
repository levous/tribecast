import React, {PropTypes, Component} from 'react';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'react-avatar';
import md5 from 'js-md5';
import { findDOMNode } from "react-dom";
import scrollIntoView from "scroll-into-view";
import defaults from '../../../../config/community-defaults';
//TODO: convert styles.listStyle to className

export default class MemberList extends Component {
  constructor(props, context) {
    super(props, context);
    this.listItems = [];
  }

  scrollSelectedItemIntoView(targetMemberId) {

    // scroll the selected item into view
    // loop the members and find the selected item
    this.props.members.forEach((member, i) => {
      if(targetMemberId === member.id){
        // retrieve the dom node using the ref pattern.
        //TODO: Not happy that this has a strong dependency on the render list ref code.  Thoughts?
        const activeItemElement = findDOMNode(this.listItems[i]);
        scrollIntoView(activeItemElement);
      }
    });
  }

  componentDidUpdate(){

      this.scrollSelectedItemIntoView(this.props.selectedMemberId);
    
  }

  handleItemTouchTap(member){
    console.log('handleItemTouchTap', member.id);
    this.props.onSelectItem(member);
  }

  render() {
    const styles = {
      selectedRow: {
        border: '1px solid #82b186'
      },
      listStyle: {
        overflow: 'scroll',
        WebkitOverflowScrolling: 'touch'
      },
      confidentlyMatchedRecord: {
        backgroundColor: '#cdecf0'
      },
      questionablyMatchedRecord: {
        backgroundColor: '#fcf8e3'
      },
      verifiedNewRecord: {
        backgroundColor: '#daf1d0'
      }
    };

    const className = this.props.selectedMemberId ? 'member-list-container squeeze' : 'member-list-container'

    const computeStyle = (member => {
      //TODO: abstract this logic for determining match strength

      let style = (this.props.selectedMemberId === member.id) ? styles.selectedRow : {};
      if(member.apiMatch) {
        if(!member.apiMatch.matchingFields || member.apiMatch.matchingFields.length === 0){
          style = Object.assign({}, style, styles.verifiedNewRecord);
        }else if(member.apiMatch.apiRecord._id === member.id || member.apiMatch.matchingFields.length > 2) {
          style = Object.assign({}, style, styles.confidentlyMatchedRecord);
        }else{
          style = Object.assign({}, style, styles.questionablyMatchedRecord);
        }
      }
      return style;
    });

    console.log('member count',this.props.members.length);

    return (
      <div style={styles.listStyle} className={className}>

        <List>
          {
            this.props.members.map((member, i) => {
              // sanity check
              if(!member){
                console.log('MemberList:props.members.map', 'member item was null');
                return <ListItem key={`mem${i}`} primaryText='member null' secondaryText='This indicates a problem.  Please contact support.' />
              }

              return (
              <ListItem key={`mem${i}`} ref={ref => this.listItems[i] = ref}
                leftAvatar={
                  <Avatar md5Email={member.email ? md5(member.email) : ''} name={`${member.firstName} ${member.lastName}`} round={true} size={40} />
                }
                primaryText={`${member.firstName} ${member.lastName}`}
                secondaryText={member.propertyAddress && member.propertyAddress.street}
                onTouchTap={() => this.handleItemTouchTap(member)}
                style={computeStyle(member)}
              />
            )
            })
          }
        </List>
      </div>
    );
  }

}

MemberList.propTypes = {
  members: PropTypes.array
};
