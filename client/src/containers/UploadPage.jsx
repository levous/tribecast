import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import PapaParse from 'papaparse';
import FlatButton from 'material-ui/FlatButton';
import * as memberActions from '../actions/member-actions';
import defaults from '../../../config/community-defaults';

class UploadPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      fieldMap: null,
      importData: null,
      importNote: null
    };
  }

  parseCsvFile(file){
    PapaParse.parse(file, {
      header: true,
      complete: results => {
        debugger;
        const records = results.data.filter(row => {
          // ensure not an empty row
            for(const field in row){
            if(row[field] && row[field].length > 0) return true;
          }
          return false;
        });
        const fieldMap = this.mapFields(records);
        let importNote = `importedFile:${file.name}`;
        this.setState({importData: records, importNote, fieldMap});
      }
    });
  }

  loadImportedData(data, fieldMap, importNote){
    this.props.actions.importCsv(data, fieldMap, importNote);
    this.props.actions.apiMatchCheck();
    this.props.router.push({
      pathname: '/membership',
      query: { notification: `Now viewing ${data.length} imported members` }
    });
  }

  mapFields(data) {
    if(!data || !data.length) return;
    let fieldMap = {
      'Email': null,
      'First Name': null,
      'Last Name': null,
      'Home Phone': null,
      'Mobile Phone': null,
      'Lot': null,
      'Property Address': null,
      'Alternate Address': null,
      'Hobbies': null,
      'Neighborhood': null,
      'Adult Residents': null,
      'Children': null,
      'Opt-In Directory': null,
      'Originally From': null,
      'Passions/Interests': null,
      'Profession': null,
      'Website': null
    };

    for(let field in data[0]) {
      for(let mapField in fieldMap) {
        if(field.toLowerCase() === mapField.toLowerCase()) {
          // found a match, map it
          fieldMap[mapField] = field;
          break;
        }
      }
    }

    return fieldMap;
  }

  onDrop(acceptedFiles, rejectedFiles) {

    if(acceptedFiles.length === 1 && acceptedFiles[0].type == 'text/csv'){
      this.parseCsvFile(acceptedFiles[0]);
    } else {
      alert(`I'm sorry, I can only handle a single CSV file.  I got ${acceptedFiles.length} files.  First file reports '${acceptedFiles[0].type}'`);
    }
  }

  handleImportButtonTouchTap() {
    this.loadImportedData(this.state.importData, this.state.fieldMap, this.state.importNote);
  }

  render() {
    const fieldButtonStyle = field => {
      let style = {margin: '3px', padding: '2px'};
      if(this.state.fieldMap[field]){
        style.backgroundColor = defaults.colors.bg.action;
      }else{
        style.backgroundColor = defaults.colors.bg.inactive;
        style.color = 'white';
      }
      return style;
    };

    const mappedFields = this.state.fieldMap ? Object.keys(this.state.fieldMap).map(field => this.state.fieldMap[field]) : null;

    const dataHeaderStyle = field => {
      if(mappedFields.includes(field)) {
        return {backgroundColor: defaults.colors.bg.action}
      }else{
        return {backgroundColor: defaults.colors.bg.warn}
      }
    };
    return (
        <div className="jumbotron">
          <Dropzone onDrop={ (acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles) }>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          { this.state.importData && this.state.importData.length > 0 &&
            <div>
              {Object.keys(this.state.fieldMap).map( (field, index) => (
                <FlatButton key={`headerBtn${index}`} style={fieldButtonStyle(field)}>{field}</FlatButton>
              ))}

              <div style={{overflow: 'scroll', height: '200px', width: '100%', backgroundColor: '#ffffff'}}>
                <table>
                  <thead>
                    <tr>
                      {Object.keys(this.state.importData[0]).map( (field, index) => (
                        <th key={`header${index}`} style={Object.assign({fontSize: '10px', whiteSpace: 'nowrap', padding: '10px'}, dataHeaderStyle(field))}>{field}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.importData.map( (row, index) => (
                      <tr key={`row${index}`} style={index % 2 === 0 ? {} : {backgroundColor:defaults.colors.bg.altRow}}>
                        {Object.keys(row).map( (field, index2) => <td key={`col${index}_${index2}`} style={{fontSize: '10px', color: '#888888', padding: '10px'}}>{row[field]}</td>)}
                      </tr>
                    )
                    )}
                  </tbody>
                </table>
              </div>

              <FlatButton primary={true} label='PREVIEW' style={{float:'right', margin: '20px', backgroundColor:'rgba(127, 184, 241, 0.43)'}} onTouchTap={() => this.handleImportButtonTouchTap()}/>

            </div>
          }
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
