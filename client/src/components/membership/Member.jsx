import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom'
import TweenMax from 'gsap'
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Address from './Address.jsx';
import FlatButton from 'material-ui/FlatButton';
import PropertyTextInput from '../forms/PropertyTextInput.jsx'

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
    this.setState({
      editing: !this.state.editing
    });
  }

  handlePropertyChange(member){
    this.props.onUpdate(member);
  }

  handleTabChange(value){
    this.setState({
      slideIndex: value,
    });
  }

  render() {
    const member = this.props.member;
    const editing = this.state.editing;
    const editButtonText = editing ? 'Done': 'Edit'
    const styledLabel = (htmlFor, text) => <label htmlFor={htmlFor} style={{display: 'block', paddingTop: '5px'}}>{text}</label>;
    const canEdit = this.props.canEdit;
    
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
        {canEdit && (<FlatButton primary={true} label={editButtonText} style={{float:'right'}} onTouchTap={() => this.handleEditButtonTouchTap()}/>)}
        {styledLabel('first-name', 'name')}
        <p>can edit: {`${canEdit}`}</p>
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
          <Tab label="Tab Three" value={2} />
        </Tabs>
        <SwipeableViews index={this.state.slideIndex} onChangeIndex={(index) => this.handleTabChange(index)}>
          { /* tab index 0 */ }
          <div>
            <div style={{float:'left', marginRight: '10px'}}>
              {styledLabel('mobile-phone', 'mobile')}
              <PropertyTextInput
                object={member} propertySelectorPath='mobilePhone'
                placeholder='404-555-1212' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} link='phone' id='mobile-phone'/>
            </div>
            <div>
              {styledLabel('home-phone', 'home')}
              <PropertyTextInput
                object={member} propertySelectorPath='homePhone'
                placeholder='404-555-1212' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} link='phone' id='home-phone'/>

            </div>
            <div style={{clear: 'both'}}>
              {styledLabel('email', 'email')}
              <PropertyTextInput
                object={member} propertySelectorPath='email'
                placeholder='some@such.com' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} link='email' id='email'/>

            </div>
            <div>
              {styledLabel('address', 'property address')}
              <PropertyTextInput
                object={member} propertySelectorPath='propertyAddress.street'
                placeholder='123 Storybook Ln.' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} id='address'/>
              {member.propertyAddress && member.propertyAddress.street2 && <span style={{marginRight:'5px'}}>,</span>}
              <PropertyTextInput
                object={member} propertySelectorPath='propertyAddress.street2'
                placeholder='street 2' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)}/>

            </div>
            <div>
              <PropertyTextInput
                object={member} propertySelectorPath='propertyAddress.city'
                placeholder='Vacationville' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} />

              <span style={{marginRight:'5px'}}>,</span>
              <PropertyTextInput
                object={member} propertySelectorPath='propertyAddress.state'
                placeholder='GA' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} />

              <PropertyTextInput
                object={member}
                propertySelectorPath='propertyAddress.zip'
                placeholder='30268'
                editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)}
                style={{marginLeft:'8px'}}
              />
            </div>
            <div>
              {styledLabel('alt-address', 'alternate address')}
              <PropertyTextInput
                object={member} propertySelectorPath='alternateAddress.street'
                placeholder='977 Hollywood Blvd.' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} id='alt-address'/>
              {member.alternateAddress && member.alternateAddress.street2 && <span style={{marginRight:'5px'}}>,</span>}
              <PropertyTextInput
                object={member} propertySelectorPath='alternateAddress.street2'
                placeholder='street 2' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)}/>
            </div>
            <div>
              <PropertyTextInput
                object={member} propertySelectorPath='alternateAddress.city'
                placeholder='Los Angeles' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} />

              {member.alternateAddress && member.alternateAddress.street && <span style={{marginRight:'5px'}}>,</span>}
              <PropertyTextInput
                object={member} propertySelectorPath='alternateAddress.state'
                placeholder='CA' editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)} />

              <PropertyTextInput
                object={member}
                propertySelectorPath='alternateAddress.zip'
                placeholder='90210'
                editing={editing} canEdit={canEdit}
                onChange={(newMember) => this.handlePropertyChange(newMember)}
                style={{marginLeft:'8px'}}
              />
            </div>
          </div>
          { /* tab index 1 */ }
          <div>Tab 2</div>
          { /* tab index 2 */ }
          <div>Tab 3</div>
        </SwipeableViews>
      </div>
    );
  }
}

Member.propTypes = {
  member: PropTypes.object.isRequired
};
