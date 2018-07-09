import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconContact from 'material-ui/svg-icons/action/perm-contact-calendar'
import VCard from 'vcards-js'
import communityDefaults from '../../../../config/community-defaults'


class VCardButton extends React.Component {

  constructor(){
    super()
    this.state = {
        confirmOpen: false
    };
  }


  handleVCardSave(){

    //create a new vCard
    const vCard = VCard();
    const member = this.props.member
    //set properties
    vCard.firstName = member.firstName
    vCard.lastName = member.lastName
    vCard.email = member.email

    vCard.organization = member.employer
    if(member.profilePhoto && member.profilePhoto.fullsizeURL) {
        //TODO: check url for type.
        vCard.photo.attachFromUrl(member.profilePhoto.fullsizeURL, 'PNG')
    }
    vCard.workPhone = member.officePhone
    vCard.homePhone = member.homePhone
    vCard.cellPhone = member.mobilePhone
    
    vCard.title = member.profession
    
    vCard.url = member.websiteURL

    const filename = `${encodeURI(this.props.member.firstName)}-${encodeURI(this.props.member.lastName)}.vcf`

    //TODO:  implement server side vcard. This URL isn't supported but will resolve (for now) to the main membership page
    vCard.source = `${communityDefaults.urlRoot}/membership/${filename}`;
    vCard.note = `Generated from ${communityDefaults.name} ${communityDefaults.urlRoot}`
    
    //set address information
    vCard.homeAddress.label = 'Home Address';
    vCard.homeAddress.street = member.propertyAddress.street
    vCard.homeAddress.city =  member.propertyAddress.city
    vCard.homeAddress.stateProvince = member.propertyAddress.state
    vCard.homeAddress.postalCode = member.propertyAddress.zip
    vCard.homeAddress.countryRegion = 'United States of America';

    // saveToFile() calls fs and that is not available to the browser
    
    const vCardString = vCard.getFormattedString()
    console.log(vCardString)

    const a = window.document.createElement("a")
    const file = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vCardString)
    a.href = file
    a.target = '_blank'
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    

    this.handleDialogOpen(false)
  }

  handleDialogOpen(isOpen){
    this.setState({confirmOpen: isOpen});
  }
  
  render () {
    return (
      <div style={this.props.style}>
        <FloatingActionButton onClick={() => this.handleDialogOpen(true)} mini={true} secondary={true}>
          <IconContact style={{color:'#008000'}} />
        </FloatingActionButton>
        <Dialog
            title="VCard Save"
            actions={(
            <div>
                <FlatButton label="Cancel" primary={true} keyboardFocused={true} onClick={() => this.handleDialogOpen(false)} />
                <FlatButton label="Yep" primary={true} keyboardFocused={true} onClick={() => this.handleVCardSave()} />
            </div>
            )}
            modal={true}
            open={this.state.confirmOpen}
            onRequestClose={() => this.handleDialogOpen(false)}
            bodyStyle={{padding:'0 5px'}} 
            >
            <p>It's best to lookup contacts from this source of record ({communityDefaults.name}) so they are always current and accurate.  You should only save a VCard for a personal contact.</p>
            <p style={{color: '#800000'}}>
            Are you <b>SURE</b> <i>you want to save {this.props.member.firstName}'s VCard?</i>
            </p>
            <small>Future updates won't appear on your device</small>
        </Dialog>
      </div>
    )
  }
}

VCardButton.propTypes = {
  member: PropTypes.object.isRequired
}

export default VCardButton