import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import PapaParse from 'papaparse';
import * as memberActions from '../actions/member-actions';

class UploadPage extends React.Component {

  parseCsvFile(file){
    PapaParse.parse(file, {
      header: true,
      complete: results => {
        console.log("Finished:", results.data);
        this.props.actions.importCsv(results.data);
        this.props.router.push({
          pathname: '/membership',
          query: { notification: `Now viewing ${results.data.length} imported members` }
        })
      }
    });
  }

  onDrop(acceptedFiles, rejectedFiles) {
    console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
    if(acceptedFiles.length === 1 && acceptedFiles[0].type == 'text/csv'){
      this.parseCsvFile(acceptedFiles[0]);
    } else {
      alert(`I'm sorry, I can only handle a single CSV file.  I got ${acceptedFiles.length} files.  First file reports '${acceptedFiles[0].type}'`);
    }
  }

  render() {
    return (
        <div>
          <Dropzone onDrop={ (acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles) }>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dispatch: PropTypes.func.isRequired
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(memberActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage);
