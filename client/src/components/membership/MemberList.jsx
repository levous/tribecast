import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Avatar from './Avatar';
import md5 from 'js-md5';
import { findDOMNode } from "react-dom";
import scrollIntoView from "scroll-into-view";
import defaults from '../../../../config/community-defaults';
//TODO: convert styles.listStyle to className

class MemberList extends Component {
  constructor(props, context) {
    super(props, context);
    this.listItems = [];

    this.state = {
      shouldScrollTop: false
    };

    this.renderCount = 0;

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
        return;
      }
    });
  }

  maybePerformAutoScroll(){
    if(this.props.suppressAutoScroll) return;
    // return above was not hit, scroll top if indicated by new member list
    if(this.state.shouldScrollTop){
      scrollIntoView(findDOMNode(this.listItems[0]));
      this.setState({shouldScrollTop: false});
    } else {
      this.scrollSelectedItemIntoView(this.props.selectedMemberId);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.members !== this.props.members && !this.props.suppressAutoScroll){
      this.setState({shouldScrollTop: true});
    }
  }

  componentDidUpdate(){
    this.maybePerformAutoScroll();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.members !== this.props.members){
      return true;
    }
    
    if(nextProps.selectedMemberId !== this.props.selectedMemberId) {
      return true;
    }

    return false;
  }

  handleItemTouchTap(member){
    console.log('handleItemTouchTap', member.id);
    this.props.onSelectItem(member);
  }

  render() {
    const styles = {
      defaultStyle: {
        margin: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '8px'
      },
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
      },
      failedValidationRecord: {
        backgroundColor: '#ffdddd'
      }
    };

    const className = this.props.selectedMemberId ? 'member-list-container squeeze' : 'member-list-container'

    const computeStyle = (member => {
      //TODO: abstract this logic for determining match strength
      let style = styles.defaultStyle;
      if(this.props.selectedMemberId === member.id) style = Object.assign({}, style, styles.selectedRow);
      if(member.apiMatch) {
        switch(MemberList.memberMatchType(member)) {
          case MemberList.recordImportMatchType.invalid:
            style = Object.assign({}, style, styles.failedValidationRecord);
            break;
          case MemberList.recordImportMatchType.notMatched:
            style = Object.assign({}, style, styles.verifiedNewRecord);
            break;
          case MemberList.recordImportMatchType.confidentlyMatchedRecord:
            style = Object.assign({}, style, styles.confidentlyMatchedRecord);
            break;
          case MemberList.recordImportMatchType.questionablyMatchedRecord:
            style = Object.assign({}, style, styles.questionablyMatchedRecord);
            break;
          default:
            console.error('recordImportMatchType not right; should not have reached this default case');
          break;
        }
      }

      return style;
    });

    console.log('member count',this.props.members.length);

    return (
      <div style={styles.listStyle} className={className}>
        {`I should be rendered only 1 time. actual times rendered: ${++this.renderCount}`}
        <List>
          {
            this.props.members.map((member, i) => {
              // sanity check
              if(!member){
                console.log('MemberList:props.members.map', 'member item was null');
                return <ListItem key={`mem${i}`} primaryText='member null' secondaryText='This indicates a problem.  Please contact support.' />
              }


              //const avatarSrc = member.profilePhoto && member.profilePhoto.thumbnailURL ? member.profilePhoto.thumbnailURL : null;
              const matchTag = member.apiMatch && member.apiMatch.matchingFields && member.apiMatch.matchingFields.length > 0 ? (
                <div style={{float: 'right', fontSize: '0.8em', color: '#bbbbbb', backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '1px solid rgba(255, 255, 255, 0.3)'}}><span style={{fontWeight: 'bold', fontSize: '0.7em'}}>match</span>: {member.apiMatch.matchingFields.join(', ')}</div>
              ) : '';

              return (
              <ListItem key={`mem${i}`} ref={ref => this.listItems[i] = ref}
                leftAvatar={
                  <Avatar
                    member={member} />
                }
                primaryText={
                  <div>
                  {`${member.firstName} ${member.lastName}`}
                  {member.nameSuffix && ` ${member.nameSuffix}`}
                  {matchTag}
                  </div>
                }
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
  members: PropTypes.array,
  suppressAutoScroll: PropTypes.bool
};

MemberList.recordImportMatchType = {
  invalid: 'invalid',
  notMatched: 'no match found',
  confidentlyMatchedRecord: 'confident match',
  questionablyMatchedRecord: 'questionable match'
};

MemberList.memberMatchType = (member) => {

  if(!member.apiMatch || !member.apiMatch.matchingFields || member.apiMatch.matchingFields.length === 0) return MemberList.recordImportMatchType.notMatched;
  if(member.validationErrors) return MemberList.recordImportMatchType.invalid;
  if(member.apiMatch.apiRecord._id === member.id || member.apiMatch.matchingFields.length > 2) return MemberList.recordImportMatchType.confidentlyMatchedRecord;
  return MemberList.recordImportMatchType.questionablyMatchedRecord;

};

export default MemberList;
