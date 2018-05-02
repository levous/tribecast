import React from 'react';
import PropTypes from 'prop-types';
import PropertyTextInput from '../forms/PropertyTextInput.jsx';
import StyledLabel from '../forms/StyledLabel';

const MemberContactView = ({
  member,
  editing,
  canEdit,
  onPropertyChange
}) => (
  <div>
    <div style={{display:'inline-block', marginRight: '10px'}}>
      <StyledLabel htmlFor='mobile-phone' text='mobile' />
      <PropertyTextInput
        object={member} propertySelectorPath='mobilePhone'
        placeholder='404-555-1212' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} link='phone' id='mobile-phone'/>
    </div>
    <div style={{display:'inline-block'}}>
      <StyledLabel htmlFor='home-phone' text='home' />
      <PropertyTextInput
        object={member} propertySelectorPath='homePhone'
        placeholder='404-555-1212' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} link='phone' id='home-phone'/>

    </div>
    <div style={{clear: 'both'}}>
      <StyledLabel htmlFor='email' text='email' />
      <PropertyTextInput
        object={member} propertySelectorPath='email'
        placeholder='some@such.com' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} link='email' id='email'/>

    </div>
    <div>
      <StyledLabel htmlFor='address' text='property address' />

      <PropertyTextInput
        object={member} propertySelectorPath='propertyAddress.street'
        placeholder='123 Storybook Ln.' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='address'/>
      {member.propertyAddress && member.propertyAddress.street2 && <span style={{marginRight:'5px'}}>,</span>}
      <PropertyTextInput
        object={member} propertySelectorPath='propertyAddress.street2'
        placeholder='street 2' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange}/>
    </div>
    <div>
      <PropertyTextInput
        object={member} propertySelectorPath='propertyAddress.city'
        placeholder='Vacationville' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} style={{marginRight:'0'}}/>
      <span style={{marginRight:'5px'}}>,</span>
      <PropertyTextInput
        object={member} propertySelectorPath='propertyAddress.state'
        placeholder='GA' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} />

      <PropertyTextInput
        object={member}
        propertySelectorPath='propertyAddress.zip'
        placeholder='30268'
        editing={editing} canEdit={canEdit}
        onChange={onPropertyChange}
        style={{marginLeft:'8px'}}
      />
    </div>
    <div>
      <StyledLabel htmlFor='alt-address' text='alternate address' />
      <PropertyTextInput
        object={member} propertySelectorPath='alternateAddress.street'
        placeholder='977 Hollywood Blvd.' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='alt-address'/>
      {member.alternateAddress && member.alternateAddress.street2 && <span style={{marginRight:'5px'}}>,</span>}
      <PropertyTextInput
        object={member} propertySelectorPath='alternateAddress.street2'
        placeholder='street 2' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange}/>
    </div>
    <div>
      <PropertyTextInput
        object={member} propertySelectorPath='alternateAddress.city'
        placeholder='Los Angeles' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} />

      {member.alternateAddress && member.alternateAddress.street && <span style={{marginRight:'5px'}}>,</span>}
      <PropertyTextInput
        object={member} propertySelectorPath='alternateAddress.state'
        placeholder='CA' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} />

      <PropertyTextInput
        object={member}
        propertySelectorPath='alternateAddress.zip'
        placeholder='90210'
        editing={editing} canEdit={canEdit}
        onChange={onPropertyChange}
        style={{marginLeft:'8px'}}
      />
    </div>
    <div>
      <StyledLabel htmlFor='neighborhood' text='neighborhood' />
      <PropertyTextInput
        object={member} propertySelectorPath='neighborhood'
        placeholder='Swann Ridge' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='neighborhood'/>
    </div>

  </div>
);

MemberContactView.propTypes = {
  member: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  canEdit: PropTypes.bool,
  onPropertyChange:PropTypes.func.isRequired
};

export default MemberContactView;
