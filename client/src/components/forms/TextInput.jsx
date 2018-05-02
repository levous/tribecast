import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class TextInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: props.text || ''
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillUnmount() {
    // ensure the input field releases focus.  iOS is leaving the keyboard presented and then sh%# gets real!
    this.textInput.blur();
  }

  componentDidMount() {
    if(this.props.autoFocus){
      this.textInput.focus();
    }
  }

  onChange(e){
    const text = e.target.value.trim();
    this.props.onChange(e.target.value);
  }

  handleKeyDown(e) {
    if (e.which === 13) {
      this.onChange(e);
    }
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleBlur(e) {
    this.onChange(e)
  }

  render() {
    return (
      <input
        type="text"
        placeholder={this.props.placeholder}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        ref={input => {
            this.textInput = input;
          }
        }
      />
    );
  }
}

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string
};

export default TextInput;
