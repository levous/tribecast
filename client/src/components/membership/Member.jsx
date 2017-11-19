import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom'
import TweenMax from 'gsap'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Address from './Address.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import PropertyTextInput from '../forms/PropertyTextInput.jsx'
import StyledLabel from '../forms/StyledLabel'
import MemberContactView from './MemberContactView'
import MemberPeopleView from './MemberPeopleView'
import MemberPersonalView from './MemberPersonalView'
import ProfilePhotoIcon from './ProfilePhotoIcon'
import MemberProfilePhotoEditor from './MemberProfilePhotoEditor'

export default class Member extends Component {
  constructor(){
    super()
    this.state = {
			editing: false,
      swipeIndex: 0
		};
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo(el, 0.3, {y: 300, opacity: 1}, {y: 0, opacity: 1});
  }
  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo(el, 0.3, {y: 0, opacity: 1, backgroundColor: '#000000'}, {y: -300, opacity: 0});
  }

  handleEditButtonTouchTap(){
    //TODO: move this up to the page component so that editing can be passed in through props and automatcially invoked by new member creation
    this.setState({
      editing: !this.state.editing
    });
  }

  handleInviteButtonTouchTap(member){
    this.props.onInvite(member);
  }

  handlePropertyChange(member){
    this.props.onUpdate(member);
  }

  handleTabChange(value){
    this.setState({
      slideIndex: value,
    });
  }

  handleProfileImageTouchTap(img){
    debugger;
  }

  render() {
    const member = this.props.member;
    member.profilePhoto = {
      thumbnailURL: 'https://pbs.twimg.com/profile_images/725013638411489280/4wx8EcIA.jpg',
      fullsizeURL: 'https://pbs.twimg.com/profile_images/725013638411489280/4wx8EcIA.jpg'
    };

    const editing = this.state.editing;
    const editButtonText = editing ? 'Done': 'Edit'
    const canEdit = this.props.canEdit;
    const canInvite = this.props.canInvite && !member.memberUserKey && member.email;

    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
      slide: {
        padding: 10,
      },
    };

    return (
      <div key={`member${member.id}`} style={{}}>
        {canEdit && (<RaisedButton primary={true} label={editButtonText} style={{float:'right'}} onTouchTap={() => this.handleEditButtonTouchTap()}/>)}
        {canInvite && (<RaisedButton secondary={true} label='Invite' style={{float:'right'}} onTouchTap={() => this.handleInviteButtonTouchTap(member)}/>)}
        <ProfilePhotoIcon thumbnailURL={member.profilePhoto.thumbnailURL} fullsizeURL={member.profilePhoto.fullsizeURL} />
        <StyledLabel htmlFor='first-name' text='name' />
        <h2 style={{marginTop: 0}}>
          <PropertyTextInput object={member} propertySelectorPath='firstName'
            placeholder='First Name' editing={editing} canEdit={canEdit} autoFocus={true}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='first-name'/>
          <PropertyTextInput object={member} propertySelectorPath='lastName'
            placeholder='Last Name' editing={editing} canEdit={canEdit} style={{marginLeft:'10px'}}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='last-name'/>
        </h2>
        <Tabs onChange={(index) => this.handleTabChange(index)} value={this.state.slideIndex} style={{margin: '5px -5px'}}>
          <Tab label="Contact" value={0} />
          <Tab label="People" value={1} />
          <Tab label="Personal" value={2} />
          <Tab label="Photo" value={3} />
        </Tabs>

        <div style={
            {
              position:'fixed', left: 0, right: 0, zIndex: -1,
              backgroundImage: 'url(https://avatars3.githubusercontent.com/u/471278?s=88&v=4)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              height: '800px', width: '1200px', display: 'block',
              WebkitFilter: 'blur(10px) brightness(200%) contrast(75%) saturate(20%) opacity(20%)'
            }
          }></div>


        <SwipeableViews index={this.state.slideIndex} onChangeIndex={(index) => this.handleTabChange(index)} >
          { /* tab index 0 */ }
          <MemberContactView
            member={member}
            onPropertyChange={(newMember) => this.handlePropertyChange(newMember)}
            editing={editing}
            canEdit={canEdit}
          />
          { /* tab index 1 */ }
          <MemberPeopleView
            member={member}
            onPropertyChange={(newMember) => this.handlePropertyChange(newMember)}
            editing={editing}
            canEdit={canEdit}
          />
          { /* tab index 2 */ }
          <MemberPersonalView
            member={member}
            onPropertyChange={(newMember) => this.handlePropertyChange(newMember)}
            editing={editing}
            canEdit={canEdit}
          />
          <MemberProfilePhotoEditor />
        </SwipeableViews>
      </div>
    );
  }
}

Member.propTypes = {
  member: PropTypes.object.isRequired
};
