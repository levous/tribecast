import React, {Component, PropTypes} from 'react';
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
      targetObject = targetObject[propertyName];
    });
    return targetObject;
  }

  setPropertyValue(object, value, propertySelectorPath, ) {
    const selectorPaths = propertySelectorPath.split('.');
    let targetObject = object;
    const propertyName = selectorPaths[selectorPaths.length-1];

    for(let idx=0;idx<selectorPaths.length-1;idx++){
      targetObject = targetObject[selectorPaths[idx]];
    }
  
    console.log(targetObject);
    console.log(value);
    console.log(propertyName);
    targetObject[propertyName] = value;
  }

  constructor(props, context) {
    super(props, context);
    const text = this.getPropertyValue(props.object, props.propertySelectorPath);
    const editing = props.editing;

    this.state = {
      editing: props.editing,
      text: text
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
    this.setState({editing: true});
  }


  render() {
    const text = this.state.text;
    const className = classnames('property-text', this.props.className)
    let element;
    if(this.state.editing || this.props.editing){
      element = (
        <TextInput
          text={text}
          editing={this.state.editing}
          onChange={(text) => this.handleChange(text)}
          className={className}
          style={this.props.style}
        />
      );
    }else{
      element = (
        <span onDoubleClick={() => this.handleDoubleClick()} className={className} style={this.props.style}>{text}</span>
      );
    }

    return element;
  }
}

PropertyTextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  propertySelectorPath: PropTypes.string.isRequired,
  object: PropTypes.object.isRequired
};

export default PropertyTextInput;
