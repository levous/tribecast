import React from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone';
import Slider from 'rc-slider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconRotateRight from 'material-ui/svg-icons/image/rotate-right';
import 'rc-slider/assets/index.css';

class MemberProfilePhotoEditor extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      photo: this.props.photoURL || 'https://media2.fdncms.com/sacurrent/imager/5-of-the-most-interesting-commercials-in-t/u/big/2258219/46933380jpg?cb=1454774688',
      zoom: 1,
      rotate: 0,
      dropMessage: 'Tap HERE to upload a new PHOTO'
    };
  }

  onDrop(acceptedFiles, rejectedFiles) {
    if(acceptedFiles.length === 1 && acceptedFiles[0].type.substr(0, 5) === 'image'){
      this.setState({photo: acceptedFiles[0]});
    } else {
      this.setState({dropMessage: 'Please drop or upload only one image file'});
    }
  }

  rotateRight(){
    let rotate = this.state.rotate + 90;
    if(rotate === 360) rotate = 0;
    this.setState({rotate: rotate});
  }

  cancel(){
    this.props.onCancelled()
  }

  save(){

    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas().toBlob((img)=>{
        this.props.onImageChanged(img, img, img);
      });

    }
  }

  onSlide(value) {
    this.setState({zoom: value / 10});
  }

  setEditorRef = (editor) => this.editor = editor

  render () {
    // check because there is an iOS11 bug
    const runningAsWebApp = window.navigator.standalone;
    return (
      <div>

        <AvatarEditor
          ref={this.setEditorRef}
          image={this.state.photo}
          width={180}
          height={180}
          border={30}
          scale={this.state.zoom}
          rotate={this.state.rotate}
          borderRadius={90}
          color={[255, 255, 255, 0.8]}
        />

        <IconButton onTouchTap={() => this.rotateRight()} style={{float: 'right', margin: '-40px 5px 0 5px'}}>
          <IconRotateRight />
        </IconButton>

        <Slider value={this.state.zoom * 10} min={1} max={20} onChange={(value) => this.onSlide(value)}/>

        {runningAsWebApp && (
          <div>
            <h3 style={{color:'red'}}>iOS11 Camera Bug!</h3>
            <small>iOS 11 will not show the camera when running as a web app.  Until Apple fixes this, please select a photo from your camera roll.</small>
          </div>
        )}
        <Dropzone onDrop={ (acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles) } style={{textAlign:'center', height:'40px', backgroundColor:'#efefef', clear: 'both'}}>
          <div style={{textAlign:'center', height:'40px'}}>{this.state.dropMessage}</div>
        </Dropzone>

        <FlatButton label="Save" primary={true} keyboardFocused={true} onClick={() => this.save() } style={{float:'right', margin: '10px'}} />
        <FlatButton label="Cancel" primary={false} onClick={() => this.cancel() } style={{float:'right', margin: '10px'}} />

      </div>
    )
  }
}

MemberProfilePhotoEditor.propTypes = {
  photoURL: PropTypes.string,
  onCancelled: PropTypes.func.isRequired,
  onImageChanged: PropTypes.func.isRequired
};

export default MemberProfilePhotoEditor
