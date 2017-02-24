import React, {PropTypes} from 'react';

const StyledLabel = ({
  htmlFor,
  text,
  style
}) => (
  <label htmlFor={htmlFor} style={{display: 'block', paddingTop: '5px'}}>{text}</label>
);

StyledLabel.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired
};

export default StyledLabel;
