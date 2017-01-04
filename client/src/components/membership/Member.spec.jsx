import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Member from './Member';

function setup(propOverrides) {
  const props = Object.assign({
    id: 1,
    firstName: 'Fred',
    lastName: 'Flintstone'
  }, propOverrides);

  const renderer = TestUtils.createRenderer();
  renderer.render(<Member member={props}/>);
  const output = renderer.getRenderOutput();

  return {
    output,
    props,
    renderer
  };
}

describe('Member component', () => {
  it('should render member item', () => {
    const {output} = setup();
    expect(output.type).toBe('div');
    expect(output).toEqual(
      <div key="member1">
        <h2>Fred Flintstone</h2>
        <div>missing property address</div>
      </div>
    );
  });
});
