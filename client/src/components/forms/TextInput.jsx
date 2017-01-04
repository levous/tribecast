import React, {Component, PropTypes} from 'react';
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
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
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
