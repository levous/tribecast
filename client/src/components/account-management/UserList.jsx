import React, {PropTypes, Component} from 'react';
import { List, ListItem } from 'material-ui/List';
import md5 from 'js-md5';
import { findDOMNode } from "react-dom";
import scrollIntoView from "scroll-into-view";
import defaults from '../../../../config/community-defaults';
import Logger from '../../modules/Logger';
//TODO: convert styles.listStyle to className

export default class UserList extends Component {
  constructor(props, context) {
    super(props, context);
    this.listItems = [];

    this.state = {
      shouldScrollTop: false
    };
  }

  scrollSelectedItemIntoView(targetUserId) {
    // scroll the selected item into view
    // loop the users and find the selected item
    this.props.users.forEach((user, i) => {
      if(targetUserId === user.id){
        // retrieve the dom node using the ref pattern.
        const activeItemElement = findDOMNode(this.listItems[i]);
        scrollIntoView(activeItemElement);
        return;
      }
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.users !== this.props.users){
      this.setState({shouldScrollTop: true});
    }
  }

  componentDidUpdate(){
    // return above was not hit, scroll top if indicated by new user list
    if(this.state.shouldScrollTop){
      scrollIntoView(findDOMNode(this.listItems[0]));
      this.setState({shouldScrollTop: false});
    } else {
      this.scrollSelectedItemIntoView(this.props.selectedUserId);
    }
  }

  handleItemTouchTap(user){
    this.props.onSelectItem(user);
  }


  render() {
    const styles = {
      selectedRow: {
        border: '1px solid #82b186'
      },
      listStyle: {
        overflow: 'scroll',
        WebkitOverflowScrolling: 'touch'
      }
    };

    const className = this.props.selectedUserId ? 'member-list-container squeeze' : 'member-list-container'

    const computeStyle = (user => {

      let style = (this.props.selectedUserId === user.id) ? styles.selectedRow : {};
      return style;
    });

    console.log('user count',this.props.users.length);

    return (
      <div style={styles.listStyle} className={className}>

        <List>
          {
            this.props.users.map((user, i) => {
              // sanity check
              if(!user){
                Logger.logWarn({source: 'UserList:props.users.map', description: 'user item was null'});
                return <ListItem key={`mem${i}`} primaryText='user null' secondaryText='This indicates a problem.  Please contact support.' />
              }

              return (
              <ListItem key={`mem${i}`} ref={ref => this.listItems[i] = ref}
                primaryText={`${user.name}`}
                secondaryText={user.email}
                onTouchTap={() => this.handleItemTouchTap(user)}
                style={computeStyle(user)}
              />
            )
            })
          }
        </List>
      </div>
    );
  }

}

UserList.propTypes = {
  users: PropTypes.array
};
