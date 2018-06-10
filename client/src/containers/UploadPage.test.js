import UploadPage from './UploadPage'
import ReactTestUtils from 'react-dom/test-utils';
import React from 'react';

describe('uploadPage', () => {

  it('maps fields automatically', () => {
    let page = ReactTestUtils.renderIntoDocument(
      <UploadPage />
    );

    const data = {
      'First Name': 'Fred',
      'Home Phone': '404-510-1111'
    };

    const fieldMap = uploadPage.mapFields(data);
    expect(fieldMap['First Name']).toEqual('FIrst Name');
  });
});
