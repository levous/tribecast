import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TextInput from './TextInput.jsx'

//TODO: Build this
// 1. pass object and property selector as props
// 2. wire to TextInput, set text using property selector on object
// 3. handle updates, apply value to copy of object using prop selector, lift property up upon changes

class PropertyTextInput extends Component {

  getPropertyValue(object, propertySelectorPath) {
    const selectorPaths = propertySelectorPath.split('.');
    let targetObject = object;
    selectorPaths.forEach(function(propertyName){
      if(!targetObject) return;
      targetObject = targetObject[propertyName];
    });
    return targetObject;
  }

  setPropertyValue(object, value, propertySelectorPath, ) {
    const selectorPaths = propertySelectorPath.split('.');
    let targetObject = object;
    const pathCount = selectorPaths.length;
    const propertyName = selectorPaths[pathCount-1];
    for(let idx=0; idx < pathCount-1; idx++){
      let tryTargetObject = targetObject[selectorPaths[idx]];
      // when setting a property where it was previously empty, the parent may also be missing
      if(!tryTargetObject && idx < pathCount - 1) {
        // stub the parent
        tryTargetObject = {};
        targetObject[selectorPaths[idx]] = tryTargetObject;
      }
      targetObject = tryTargetObject;
    }





    //TODO Use ObjectAssign on the hierarchy to return a copy.  This is mutating the original object which is not allowed.
    /*
    // better way than this?
    const newObject = {};
    newObject[propertyName] = value;
    // now iterate back up the chain to merge updated replacements?
    */

    targetObject[propertyName] = value;
  }

  constructor(props, context) {
    super(props, context);
    const text = this.getPropertyValue(props.object, props.propertySelectorPath);
    const {editing, autoFocus} = props;

    this.state = {
      editing: editing,
      text: text,
      autoFocus: autoFocus
    };
  }

  handleChange(text){
    const targetObject = this.props.object;
    this.setPropertyValue(targetObject, text, this.props.propertySelectorPath);
    this.setState({
      editing: false,
      text: text
    });
    this.props.onChange(targetObject);
  }

  handleDoubleClick(e){
    if(!this.props.canEdit) return;
    this.setState({
      editing: true,
      autoFocus: true
    });
  }


  render() {
    const text = this.state.text;
    const className = classnames('property-text', this.props.className)
    const {placeholder, editing} = this.props;
    let element;
    if(this.state.editing || editing){
      element = (
        <TextInput
          text={text}
          placeholder={placeholder}
          editing={this.state.editing}
          onChange={(text) => this.handleChange(text)}
          autoFocus={this.state.autoFocus}
          className={className}
          style={this.props.style}
        />
      );
    }else{
      let linkOrText = text;
      if(this.props.link) {
        switch(this.props.link) {
          case 'phone':
            linkOrText = <a href={`tel:${text}`}>{text}</a>
            break;
          case 'email':
            linkOrText = <a href={`mailto:${text}`}>{text}</a>
            break;
          default:
            break;
        }
      }
      element = (
        <span onDoubleClick={() => this.handleDoubleClick()} className={className} style={this.props.style}>
          {linkOrText}
        </span>
      );
    }

    return element;
  }
}

PropertyTextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  propertySelectorPath: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  object: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  link: PropTypes.string
};

export default PropertyTextInput;
