import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'
import TweenMax from 'gsap'
import {Tabs, Tab} from 'material-ui/Tabs';
import Toggle from 'material-ui/Toggle';
import SwipeableViews from 'react-swipeable-views';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {member_data_sources} from '../../actions/member-actions';
import PropertyTextInput from '../forms/PropertyTextInput.jsx'
import StyledLabel from '../forms/StyledLabel'
import MemberContactView from './MemberContactView'
import MemberPeopleView from './MemberPeopleView'
import MemberPersonalView from './MemberPersonalView'
import ProfilePhotoIcon from './ProfilePhotoIcon'
import MemberProfilePhotoEditor from './MemberProfilePhotoEditor'
import VCardButton from './VCardButton'

export default class Member extends Component {
  constructor(){
    super()
    this.state = {
      swipeIndex: 0,
      profileImageEditing: false,
      recordToggled: false
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
    this.props.onEditing(!this.props.editing);
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

  handleProfileImageEditTouchTap(img){
    this.setState({profileImageEditing: true});
  }

  handleProfileImageEditClose() {
    this.setState({profileImageEditing: false});
  }

  handleProfileImageChanged(thumbnailImage, fullsizeImage, unEditedImage){
    this.props.onProfileImageChanged(this.props.member, thumbnailImage, fullsizeImage, unEditedImage);
    this.setState({profileImageEditing: false});
  }

  handleRecordToggle(toggled) {
    this.setState({recordToggled: toggled});
    return toggled;
  }

  handleUnLinkApiMatch(member) {
    this.setState({recordToggled: false});
    this.props.onUnLinkApiMatch(member)
  }

  render() {

    const member = this.state.recordToggled ? this.props.member.apiMatch.apiRecord : this.props.member;
    const editing = this.props.editing;
    const isImport = this.props.dataSource === member_data_sources.CSV_IMPORT;
    const hasProfilePhoto = member.profilePhoto && member.profilePhoto.thumbnailURL;
    const editButtonText = editing ? 'Done': 'Edit'
    const canEdit = this.props.canEdit && !this.state.recordToggled;
   
    const canInvite = !isImport && this.props.canInvite && !this.state.recordToggled && !member.memberUserKey && member.email;
    const isLinked = this.props.member.apiMatch && this.props.member.apiMatch.apiRecord
    const handleProfileImageTap = editing ? (img) => {this.handleProfileImageEditTouchTap(img)} : undefined;
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

    const profileIcon = (() => {
      // if a profile photo is present, show that instead.  It supports editing
      if (hasProfilePhoto) {
        const icon = (<ProfilePhotoIcon key='icon' thumbnailURL={member.profilePhoto.thumbnailURL} fullsizeURL={member.profilePhoto.fullsizeURL} onProfileImageTouchTap={handleProfileImageTap} />);
        if(editing) return [icon, (<div key='overlay' style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))', color: 'white', position: 'absolute', width: '50px', margin: '10px', fontSize: '.7em', textAlign: 'center'}} onClick={handleProfileImageTap}>tap to edit</div>)];
        return icon;
      }
      // present a button for adding if editing
      if (editing){
        return (<RaisedButton secondary={true} label='Photo' onClick={(e) => {e.preventDefault(); this.handleProfileImageEditTouchTap()}}/>);
      }
      // no presentation if not editing and no image available
      return '';
    })();

    //TODO: refactor me!  Probably a separate control and not so ugly
    const toggleLabelStyle = (isAPI) => {
      let style = {};
      if((isAPI && this.state.recordToggled) || (!isAPI && !this.state.recordToggled)) {
        style.color = 'green';
      }
      style.textAlign = isAPI ? 'left': 'right'
      return style;
    }

    const buttonStyle = {
      float:'right',
      margin: '3px'
    }

    return (
      <div key={`member${member.id}`} style={{}}>
        {isLinked && (<RaisedButton secondary={true} label='Unlink Record' style={Object.assign({}, buttonStyle, {backgroundColor: 'red'})} onClick={(e) => {e.preventDefault(); this.handleUnLinkApiMatch(this.props.member)}}/>)}
        {canEdit && (<RaisedButton primary={true} label={editButtonText} style={buttonStyle} onClick={(e) => {e.preventDefault(); this.handleEditButtonTouchTap()}}/>)}
        {canInvite && (<RaisedButton secondary={true} label='Invite' style={buttonStyle} onClick={(e) => {e.preventDefault(); this.handleInviteButtonTouchTap(member)}}/>)}
        {profileIcon}

        <VCardButton member={member} style={Object.assign({}, buttonStyle, {marginRight: '10px'})} />
        
        {isLinked && (
            <div style={{ maxWidth: 250, fontSize: '0.7em' }}>
              <table>
                <tbody>
                  <tr>
                    <td style={toggleLabelStyle(false)}>Imported Record</td>
                    <td style={{padding: '18px 5px 0px'}}>
                      <Toggle
                        style={{marginBottom: 16}}
                        toggled={this.state.recordToggled}
                        onToggle={(e, toggled) => { this.handleRecordToggle(toggled) }}
                      />
                    </td>
                    <td style={toggleLabelStyle(true)}>API Record</td>
                  </tr>
                </tbody>
              </table>
            </div>

          )
        }
        <StyledLabel htmlFor='first-name' text='name' />
        <h2 style={{marginTop: 0}}>

          <PropertyTextInput object={member} propertySelectorPath='firstName'
            placeholder='First Name' editing={editing} canEdit={canEdit} autoFocus={true}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='first-name'/>
          <PropertyTextInput object={member} propertySelectorPath='lastName'
            placeholder='Last Name' editing={editing} canEdit={canEdit} style={{marginLeft:'10px'}}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='last-name'/>
          <PropertyTextInput object={member} propertySelectorPath='nameSuffix'
            placeholder='Suffix' editing={editing} canEdit={canEdit} style={{marginLeft:'10px', width:'50px'}}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='suffix'/>
        </h2>
        <Tabs onChange={(index) => this.handleTabChange(index)} value={this.state.slideIndex} style={{margin: '5px -5px'}}>
          <Tab label="Contact" value={0} />
          <Tab label="People" value={1} />
          <Tab label="Personal" value={2} />
        </Tabs>

        {hasProfilePhoto && (
          <div style={
            {
              position:'fixed', left: '-20px', right: 0, zIndex: -2,
              backgroundColor: '#ffffff',
              height: '800px', width: '1200px', display: 'block',
              WebkitFilter: 'blur(10px)'
            }
          }>
            <div style={
              {
                position:'fixed', left: -20, right: 0, zIndex: -1,
                backgroundImage:  `url(${member.profilePhoto.fullsizeURL})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                height: '800px', width: '1200px', display: 'block',
                WebkitFilter: 'brightness(200%) contrast(75%) saturate(50%) opacity(40%)'
              }
            }></div>
          </div>
        )}


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

        </SwipeableViews>

        <Dialog
          title="Profile Photo Editor"
          modal={true}
          open={this.state.profileImageEditing}
          onRequestClose={() => this.handleProfileImageEditClose() }
        >
          <MemberProfilePhotoEditor photoURL={member.profilePhoto ? member.profilePhoto.fullsizeURL : null} onImageChanged={(thumbnailImage, fullsizeImage, unEditedImage) => this.handleProfileImageChanged(thumbnailImage, fullsizeImage, unEditedImage)} onCancelled={() => this.handleProfileImageEditClose() }/>
        </Dialog>


      </div>
    );
  }
}

Member.propTypes = {
  member: PropTypes.object.isRequired,
  dataSource: PropTypes.string.isRequired,
  onEditing: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onProfileImageChanged: PropTypes.func.isRequired,
  onUnLinkApiMatch: PropTypes.func.isRequired
};
