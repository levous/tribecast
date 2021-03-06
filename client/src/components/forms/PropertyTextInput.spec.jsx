import React from 'react';
import { createRenderer } from  'react-test-renderer/shallow';
import PropertyTextInput from './PropertyTextInput.jsx';

function setup(propOverrides) {
  const props = Object.assign({
    text: 'Lorem Ipsum',
    editing: false,
    propertySelector: 'address/street'
  }, propOverrides);

  const renderer = createRenderer();
  renderer.render(<PropertyTextInput address={props}/>);
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
