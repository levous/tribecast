import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom'
import TweenMax from 'gsap'

import Address from './Address.jsx';
import FlatButton from 'material-ui/FlatButton';
import PropertyTextInput from '../forms/PropertyTextInput.jsx'

export default class Member extends Component {
  constructor(){
    super()
    this.state = {
			editing: false,
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
    this.setState({editing: !this.state.editing});
  }

  handlePropertyChange(member){
    this.props.onUpdate(member);
  }



  render() {
    const member = this.props.member;
    const editing = this.state.editing;
    const editButtonText = editing ? 'Done': 'Edit'
    const styledLabel = (htmlFor, text) => <label htmlFor={htmlFor} style={{display: 'block'}}>{text}</label>;
    return (
      <div key={`member${member.id}`} style={{marginTop: '20px'}}>
        <FlatButton primary={true} label={editButtonText} style={{float:'right'}} onTouchTap={() => this.handleEditButtonTouchTap()}/>
        {styledLabel('firstName', 'name')}
        <h2 style={{marginTop: 0}}>
          <PropertyTextInput object={member} propertySelectorPath={'firstName'} editing={editing}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='firstName'/>
          <PropertyTextInput object={member} propertySelectorPath={'lastName'} editing={editing} style={{marginLeft:'10px'}}
            onChange={(newMember) => this.handlePropertyChange(newMember)} />
        </h2>

        <div>
          {styledLabel('address', 'property address')}
          <PropertyTextInput
            object={member} propertySelectorPath={'propertyAddress.street'} editing={editing}
            onChange={(newMember) => this.handlePropertyChange(newMember)} id='address'/>

        </div>
        <div>
          <PropertyTextInput
            object={member} propertySelectorPath={'propertyAddress.city'} editing={editing}
            onChange={(newMember) => this.handlePropertyChange(newMember)} />

          <span style={{marginRight:'5px'}}>,</span>
          <PropertyTextInput
            object={member} propertySelectorPath={'propertyAddress.state'} editing={editing}
            onChange={(newMember) => this.handlePropertyChange(newMember)} />

          <PropertyTextInput
            object={member}
            propertySelectorPath={'propertyAddress.zip'}
            editing={editing}
            onChange={(newMember) => this.handlePropertyChange(newMember)}
            style={{marginLeft:'8px'}}
          />
        </div>
      </div>
    );
  }
}

Member.propTypes = {
  member: PropTypes.object.isRequired
};
