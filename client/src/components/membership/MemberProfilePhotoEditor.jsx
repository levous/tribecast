import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone';
import Slider from 'nw-react-slider';
import 'nw-react-slider/dist/nw-react-slider.min.css';
import '../../../stylesheets/components/_slider.scss';

class MemberProfilePhotoEditor extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      photo: this.props.photoURL || 'https://media2.fdncms.com/sacurrent/imager/5-of-the-most-interesting-commercials-in-t/u/big/2258219/46933380jpg?cb=1454774688',
      zoom: 1,
      dropMessage: 'Drop an image here or tap to select an image to upload'
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if(acceptedFiles.length === 1 && acceptedFiles[0].type.substr(0, 5) === 'image'){
      this.setState({photo: acceptedFiles[0]});
    } else {
      this.setState({dropMessage: 'Please drop or upload only one image file'});
    }
  }

  onSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }

  onSlide(value, position) {
    this.setState({zoom: value / 10});
  }

  setEditorRef = (editor) => this.editor = editor

  render () {
    return (
      <div>
        <style>{
          ``
        }</style>
        <AvatarEditor
          ref={this.setEditorRef}
          image={this.state.photo}
          width={180}
          height={180}
          border={30}
          scale={this.state.zoom}
          borderRadius={90}
          color={[255, 255, 255, 0.8]}
        />

      <Slider value={this.state.zoom * 10} min={1} max={20} onChange={(value, position) => this.onSlide(value, position)} />
        <Dropzone onDrop={ (acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles) } style={{textAlign:'center', height:'40px', backgroundColor:'#efefef'}}>
          <div style={{textAlign:'center', height:'40px'}}>{this.state.dropMessage}</div>
        </Dropzone>

      </div>
    )
  }
}

MemberProfilePhotoEditor.propTypes = {
  photoURL: React.PropTypes.string
};

export default MemberProfilePhotoEditor
