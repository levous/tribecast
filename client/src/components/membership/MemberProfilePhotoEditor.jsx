import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone';

class MemberProfilePhotoEditor extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      photo: 'https://media2.fdncms.com/sacurrent/imager/5-of-the-most-interesting-commercials-in-t/u/big/2258219/46933380jpg?cb=1454774688'
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    debugger;
    if(acceptedFiles.length === 1 ){ //&& acceptedFiles[0].type == 'text/csv'){
      this.setState({photo: acceptedFiles[0]});
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

  setEditorRef = (editor) => this.editor = editor

  render () {
    return (
      <div>
        <AvatarEditor
          ref={this.setEditorRef}
          image={this.state.photo}
          width={250}
          height={250}
          border={50}
          scale={1.2}
        />

        <Dropzone onDrop={ (acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles) }>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    )
  }
}

export default MemberProfilePhotoEditor
