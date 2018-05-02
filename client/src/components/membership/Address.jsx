import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Address = (props) => {

  const {address} = props;
  let streetFull;
  if (address.street2) {
    streetFull = `${address.street}, ${address.street2}`;
  } else {
    streetFull = address.street;
  }
  return (
    <div>
      <div>{streetFull}</div>
      <div>{`${address.city}, ${address.state} ${address.zip}`}</div>
    </div>
  );
}


Address.propTypes = {
  address: PropTypes.object.isRequired
};

export default Address;
