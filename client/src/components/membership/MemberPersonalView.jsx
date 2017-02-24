import React, {PropTypes} from 'react';
import PropertyTextInput from '../forms/PropertyTextInput.jsx'
import StyledLabel from '../forms/StyledLabel'

const MemberPersonalView = ({
  member,
  editing,
  canEdit,
  onPropertyChange
}) => (
  <div>
    <div>
      <StyledLabel htmlFor='originally-from' text='originally from' />
      <PropertyTextInput
        object={member} propertySelectorPath='originallyFrom'
        placeholder='Martian Asteroid Belt' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='originally-from'/>
    </div>
    <div>
      <StyledLabel htmlFor='profession' text='profession' />
      <PropertyTextInput
        object={member} propertySelectorPath='profession'
        placeholder='What do you do or, if retired, did you do professionally?' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='profession'/>

    </div>
    <div>
      <StyledLabel htmlFor='passions' text='passions/interests' />
      <PropertyTextInput
        object={member} propertySelectorPath='passionsInterests'
        placeholder='What gets you fired up?' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='passions'/>

    </div>
    <div>
      <StyledLabel htmlFor='hobbies' text='hobbies' />
      <PropertyTextInput
        object={member} propertySelectorPath='hobbies'
        placeholder='What do you do for fun?' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='hobbies'/>

    </div>
    <div>
      <StyledLabel htmlFor='website' text='website' />
      <PropertyTextInput
        object={member} propertySelectorPath='websiteURL'
        placeholder='http://www.myHomeOnTheWorldWideWeb.com' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='website'/>

    </div>

  </div>
);

MemberPersonalView.propTypes = {
  member: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  canEdit: PropTypes.bool,
  onPropertyChange:PropTypes.func.isRequired
};

export default MemberPersonalView;
