import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Address from './Address';

function setup(propOverrides) {
  const props = Object.assign({
    street: '123 Anywhere Rd.',
    city: 'Atlanta',
    state: 'GA',
    zip: '30306'
  }, propOverrides);

  const renderer = TestUtils.createRenderer();
  renderer.render(<Address address={props}/>);
  const output = renderer.getRenderOutput();

  return {
    props,
    output,
    renderer
  };
}

describe('Address component', () => {
  it('should render default text', () => {
    const address = {
      street: '432 Here Rd.',
      city: 'Macon',
      state: 'GA',
      zip: '30456'
    };
    const {output} = setup(address);
    const [street] = output.props.children;

    expect(street).toEqual(
      <div>432 Here Rd.</div>
    );
  });
});
