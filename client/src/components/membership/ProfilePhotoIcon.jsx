import React, {PropTypes} from 'react';


export default class ProfilePhotoIcon extends React.Component {

  handleProfileImageTouchTap(img){
    debugger;
  }

  render () {
    return (
      <img src={this.props.thumbnailURL}
        style={{float: 'left', marginRight: '10px', height: '70px', borderRadius: '100%'}}
        onTouchTap={(img)=>{this.handleProfileImageTouchTap(img)}} />
    )
  }
}

ProfilePhotoIcon.propTypes = {
  thumbnailURL: PropTypes.string.isRequired,
  fullsizeURL: PropTypes.string.isRequired,
};
