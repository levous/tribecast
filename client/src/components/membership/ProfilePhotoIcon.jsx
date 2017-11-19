import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class ProfilePhotoIcon extends React.Component {

  constructor(){
    super()
    this.state = {
			previewOpen: false
		};
  }


  handleProfileImageTouchTap(img){
    if(this.props.onProfileImageTouchTap){
      this.setState({previewOpen: false});
      return this.props.onProfileImageTouchTap(img)
    }
    this.setState({previewOpen: true});
  }

  handleDialogClose(){
    this.setState({previewOpen: false});
  }

  render () {
    return (
      <div>
        <img src={this.props.thumbnailURL}
          style={{float: 'left', marginRight: '10px', height: '70px', borderRadius: '100%'}}
          onTouchTap={(img)=>{this.handleProfileImageTouchTap(img)}} />
        <Dialog
          title="Profile Photo"
          actions={<FlatButton label="Close" primary={true} keyboardFocused={true} onClick={() => this.handleDialogClose()} />}
          modal={true}
          open={this.state.previewOpen}
          onRequestClose={() => this.handleDialogClose()}
          bodyStyle={{padding:'0 5px'}}
          >
          <img src={this.props.fullsizeURL} style={{width: '100%'}}/>
        </Dialog>
      </div>
    )
  }
}

ProfilePhotoIcon.propTypes = {
  thumbnailURL: PropTypes.string.isRequired,
  fullsizeURL: PropTypes.string.isRequired,
  onProfileImageTouchTap: PropTypes.func
};
