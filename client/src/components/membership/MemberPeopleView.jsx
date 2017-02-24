import React, {PropTypes} from 'react';
import PropertyTextInput from '../forms/PropertyTextInput.jsx'
import StyledLabel from '../forms/StyledLabel'

const MemberPeopleView = ({
  member,
  editing,
  canEdit,
  onPropertyChange
}) => (

  <div>
    <div>
      <StyledLabel htmlFor='adults' text='adult residents' />
      <PropertyTextInput
        object={member} propertySelectorPath='adultResidents'
        placeholder='Please list adult names and contact info' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange}  id='adults'/>
    </div>
    <div>
      <StyledLabel htmlFor='children' text='children' />
      <PropertyTextInput
        object={member} propertySelectorPath='children'
        placeholder='Sally 8, Mark 2' editing={editing} canEdit={canEdit}
        onChange={onPropertyChange} id='children'/>

    </div>

  </div>
);

MemberPeopleView.propTypes = {
  member: PropTypes.object.isRequired,
  editing: PropTypes.bool,
  canEdit: PropTypes.bool,
  onPropertyChange:PropTypes.func.isRequired
};

export default MemberPeopleView;
