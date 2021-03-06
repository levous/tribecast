import {member_action_types, member_data_sources, member_sort_keys} from '../actions/member-actions.js';
import {user_action_types} from '../actions/user-actions.js';
import {NotificationManager} from 'react-notifications';
import PapaParse from 'papaparse';
import ParseAddress from 'parse-address';
import communityDefaults from '../../../config/community-defaults';
import PhoneNumber from 'awesome-phonenumber';

const sortComparer = sortKey => {
  switch (sortKey){
    case member_sort_keys.ADDRESS:
      //TODO: ensure it don't break when property address is not there
      return (a, b) => a.propertyAddress.street.localeCompare(b.propertyAddress.street);
    default: //member_sort_keys.NAME:
      return (a, b) => {
        // create a name string and then sort by the last item in the name.
        // This handles people who have two last names.
        // They should sort in the last non-hyphenated name
        const aNameArray = `${a.firstName} ${a.lastName}`.trim().split(' ');
        const bNameArray = `${b.firstName} ${b.lastName}`.trim().split(' ');
        return aNameArray[aNameArray.length - 1].localeCompare(bNameArray[bNameArray.length - 1]) || a.firstName.localeCompare(b.firstName);
      }
  }
};

class Member {
  constructor(id, fname, lname, street, city, state, zip, mobilePhone, homePhone, email){
    this.id = id;
    this.firstName = fname;
    this.lastName = lname;
    this.propertyAddress = {
      street: street,
      city: city,
      state: state,
      zip: zip
    };
    this.mobilePhone = mobilePhone;
    this.homePhone = homePhone;
    this.email = email;
  }
}

const seedMembers = [
  new Member(666, 'Rusty', 'Brontobones', '3 Swann Rdg','Palmetto', 'GA', '30268', '(212) 555-1234', '(212) 555-9876', 'rubble@barney.com'),
  new Member(1,'Fred','Flintstone','34 Swann Rdg', 'Palmetto','GA','30268'),
  new Member(2, 'Barney', 'Rubble', '23 Serenbe Ln', 'Palmetto','GA','30268'),
  new Member(3, 'Bam Bam', 'Stonehenge'),
  new Member(4,'Danny','Dino','4445 Serenbe Ln', 'Palmetto','GA','30268'),
  new Member(15,'Vannesa', 'Heitzman','663 Glen Eagles St', 'Saratoga Springs', 'NY', '12866'),
  new Member(16,'Patrina', 'Clairmont','93 Sycamore Ave', 'Stamford', 'CT', '06902'),
  new Member(17,'Nga', 'Hott','824 South Iroquois Street', 'Suwanee', 'GA', '30024'),
  new Member(18,'Patricia', 'Dorfman','7196 Smoky Hollow St.', 'West Islip', 'NY', '11795'),
  new Member(19,'Scottie', 'Dillahunt','61 Canterbury Street', 'Catonsville', 'MD', '21228'),
  new Member(20,'Pilar', 'Bardwell','672 Windfall Drive', 'Linden', 'NJ', '07036'),
  new Member(21,'Genevive', 'Hower','13 Sunnyslope St.', 'North Royalton', 'OH', '44133'),
  new Member(22,'Rosanne', 'Aguirre','17 Olive Court', 'Orland Park', 'IL', '60462','(414) 555-1234', '(414) 555-9876', 'aguirre@comehereay.com'),
  new Member(23,'Janette', 'Bedsole','840 East Eagle Ave.', 'Harrison Township', 'MI', '48045'),
  new Member(24,'Dorris', 'Drescher','54 Green Hill Lane', 'San Jose', 'CA', '95127'),
  new Member(25,'Zenaida', 'Geibel','499 Saxon Drive', 'Lakeland', 'FL', '33801'),
  new Member(26,'Deborah', 'Rabon','222 Brickyard Street', 'New Berlin', 'WI', '53151'),
  new Member(27,'Mable', 'Delgiudice','695 S. Pendergast Avenue', 'Hopewell Junction', 'NY', '12533'),
  new Member(28,'Veronique', 'Leland','86 Amherst Ave.', 'Chesterfield', 'VA', '23832'),
  new Member(29,'Betsy', 'Briceno','252 La Sierra Road', 'Butte', 'MT', '59701'),
  new Member(30,'Indira', 'Godwin','9238 Cypress Court', 'Suwanee', 'GA', '30024'),
  new Member(31,'Lieselotte', 'Wathen','8405 E. Willow Street', 'Wisconsin Rapids', 'WI', '54494'),
  new Member(32,'Ileana', 'Ogorman','41 Elm Street', 'Newnan', 'GA', '30263'),
  new Member(33,'Cassy', 'Vanfossen','398 Smith Drive', 'Inman', 'SC', '29349'),
  new Member(34,'Malisa', 'Matzen','8728 West St.', 'Scarsdale', 'NY', '10583'),
  new Member(35,'Mckinley', 'Spigner','965 N. Bayport Lane', 'Long Branch', 'NJ', '07740'),
  new Member(36,'Alta', 'Donlon','744 2nd Street', 'Palm Beach Gardens', 'FL', '33410'),
  new Member(37,'Bryce', 'Lister','60 Heather Ave.', 'Santa Clara', 'CA', '95050'),
  new Member(38,'Elia', 'Ehrhardt','10 Pendergast St.', 'Paramus', 'NJ', '07652'),
  new Member(39,'Chuck', 'Lupo','7931 Harrison St.', 'Key West', 'FL', '33040'),
  new Member(40,'Shirleen', 'Kapoor','411 Taylor Street', 'Simpsonville', 'SC', '29680'),
  new Member(41,'Francis', 'Pappas','280 SE. Gregory Drive', 'Littleton', 'CO', '80123'),
  new Member(42,'Jamel', 'Legette','8008 Spring Dr.', 'Gainesville', 'VA', '20155'),
  new Member(43,'Theron', 'Lynn','79 W. Glenlake Street', 'Hammonton', 'NJ', '08037'),
  new Member(44,'Tarra', 'Merrihew','57 Third St.', 'Cherry Hill', 'NJ', '08003'),
  new Member(45,'Catalina', 'Barretta','175 Pineknoll Ave.', 'Stafford', 'VA', '22554'),
  new Member(46,'Joe', 'Broker','4 Circle St.', 'Hempstead', 'NY', '11550'),
  new Member(47,'Maegan', 'Rempe','7344 Newport Ave.', 'Fort Walton Beach', 'FL', '32547'),
  new Member(48,'Rubin', 'Steimle','75 Edgemont Ave.', 'Bartlett', 'IL', '60103'),
  new Member(49,'Alvaro', 'Bloodworth','187 King St.', 'Rapid City', 'SD', '57701'),
  new Member(50,'Vernon', 'Gamez','160 E. Rockledge Ave.', 'Bartlett', 'IL', '60103'),
  new Member(51,'Edgardo', 'Gearheart','7696 Miles Rd.', 'West Bloomfield', 'MI', '48322'),
  new Member(52,'Guy', 'Troncoso','8840 Mechanic Road', 'North Fort Myers', 'FL', '33917'),
  new Member(53,'Harriette', 'Doud','220 Illinois Lane', 'Camden', 'NJ', '08105'),
  new Member(54,'Elfreda', 'Priester','4 Shadow Brook Avenue', 'Ozone Park', 'NY', '11417'),
  new Member(55,'Antionette', 'Imler','435 Wagon Avenue', 'Palos Verdes Peninsula', 'CA', '90274'),
  new Member(56,'Julianne', 'Corker','544 Parker Street', 'Stone Mountain', 'GA', '30083'),
  new Member(57,'Olevia', 'Shumake','990 Sunset Ave.', 'Mankato', 'MN', '56001'),
  new Member(58,'Bella', 'Stecker','2 Jefferson Street', 'Carmel', 'NY', '10512'),
  new Member(59,'Roselee', 'To','7802 Liberty Dr.', 'West Deptford', 'NJ', '08096'),
  new Member(60,'Hollis', 'Cool','87 State Street', 'Bartlett', 'IL', '60103'),
  new Member(61,'Ligia', 'Mcelroy','104 Sherman Drive', 'Orlando', 'FL', '32806'),
  new Member(62,'Renda', 'Castellon','762 Elizabeth Drive', 'Raeford', 'NC', '28376'),
  new Member(63,'Rosaura', 'Ector','70 S. Paris Hill Lane', 'Panama City', 'FL', '32404'),
  new Member(64,'Lourie', 'Sytsma','9785 Harvey Lane', 'Riverview', 'FL', '33569')
];


const initialState = {
  members: seedMembers.sort(sortComparer(member_sort_keys.NAME)),
  //TODO: refactor to use id rather than member so that the pre-edit data is not retained
  selectedMember: undefined,
  dataSource: member_data_sources.SEED,
  invites: undefined,
  loading: false,
  sortKey: member_sort_keys.NAME
};

// to start over...
//localStorage.clear();


let memberApp = function(state = initialState, action) {

  const updateMemberInList = (state, targetMemberId, member) => {
    // find the index by id
    const targetIndex = state.members.map(function(m) {return m.id; }).indexOf(targetMemberId);
    const oldMember = state.members[targetIndex];
    let newList = [
      ...state.members.slice(0, targetIndex),
      // ensure unspecified props are not accidentally discarded and that stored object is not mutated
      Object.assign({}, state.members[targetIndex], member),
      ...state.members.slice(targetIndex + 1)
    ];

    let needSort = false;
    switch(state.sortKey) {
      case member_sort_keys.ADDRESS:
        needSort = (oldMember.propertyAddress.street !== member.propertyAddress.street || oldMember.propertyAddress.zip !== oldMember.propertyAddress.zip)
        break;
      default:
        needSort = (oldMember.lastName !== member.lastName || oldMember.firstName !== member.firstName);
        break;
    }

    if(needSort) newList = newList.sort(sortComparer(state.sortKey));

    // create a new array, containing updated item, using spread and slice
    return Object.assign({}, state, {
      members: newList
    });
  };


  const updateMultiMemberInList = (state, members) => {
    // sort both arrays
    const sortedUpdate = [...members].sort((a, b) => a.id.localeCompare(b.id));
    const sortedState = [...state.members].sort((a, b) => a.id.localeCompare(b.id));
    
    let sIdx = 0;
    const uL = sortedUpdate.length;

    for(let uIdx = 0 , uL = sortedUpdate.length; uIdx < uL; uIdx++) {
      // both arrays are correspondently sorted and iterating forward.  
      // Advance the state array until either an equal or later sorted value is found
      const sL = sortedState.length;
      while(sIdx < sL && sortedState[sIdx].id < sortedUpdate[uIdx].id) sIdx++;
      // match?
      if(sIdx < sL && sortedState[sIdx].id == sortedUpdate[uIdx].id) {
        // replace by index
        sortedState[sIdx] = sortedUpdate[uIdx];
      } else if(sIdx < sL) {
        // insert at index
        sortedState.splice(sIdx, 0, sortedUpdate[uIdx]);
      } else {
        // insert at end
        sortedState.push(sortedUpdate[uIdx]);
      }
    }

    sortedState.sort(sortComparer(state.sortKey));

    return Object.assign({}, state, {
      members: sortedState
    });
  };


  switch (action.type) {
    case member_action_types.SELECT_MEMBER:
      return Object.assign({}, state, {
        selectedMember: action.member
      });
    case member_action_types.ADD:
      const newMembers = [
        ...state.members,
        action.member
      ].sort(sortComparer(state.sortKey));

      return Object.assign({}, state, {
        members: newMembers
      });

    case member_action_types.UPDATE_SUCCESS_RECEIVED: {
      // memberId received separately because new records are assigned a temporary id 
      // so that they can be updated after saving to the server.  Perhaps using a source 
      // origin_id would have been cleaner.  hindsight === 2020
      //NotificationManager.success(`${action.member.firstName} ${action.member.lastName} Server Saved!`);
      const memberId = action.id || action.member.id;
      const member = action.member;
      let newState = updateMemberInList(state, memberId, member);

      // updated selected member if action id matches selectedMember id
      if(action.id === state.selectedMember.id) newState = Object.assign({}, newState, {selectedMember: member});

      return newState;
    }

    case member_action_types.MULTIPLE_MEMBER_UPDATES_RECEIVED: {
     
      const members = action.members;
      let newState = updateMultiMemberInList(state, members);

      // updated selected member if action id matches selectedMember id
      const selectedMemberInUpdates = state.selectedMember ? members.find(m => m.id == state.selectedMember.id) : null;
      if(selectedMemberInUpdates) newState = Object.assign({}, newState, {selectedMember: selectedMemberInUpdates});

      return newState;

    }

    case member_action_types.DELETE_SUCCESS_RECEIVED: {
      NotificationManager.success(`${action.id} successfully DELETED!`);
      const memberId = action.id;
      const newList = state.members.filter( member => member.id !== memberId );
      let selectedMember = memberId === state.selectedMember.id ? null : state.selectedMember;
      return Object.assign({}, state, {
        members: newList,
        selectedMember: selectedMember
      });
    }

    case member_action_types.UPDATE: {
      const memberId = action.id || action.member.id;
      return updateMemberInList(state, memberId, action.member);
    }

    case member_action_types.UNLINK_FROM_API_MATCH: {
    
      const memberId = action.id || action.member.id;
      const match = state.members.find(member => member.id === memberId);

      if(!match) {
        return NotificationManager.error('Not Found', 'Member record not found in state', 15000);
      }

      const updated = Object.assign(
        match,
        {
          apiMatch: {
            matchingFields: [],
            apiRecord: null,
            validationErrors: match.validationErrors
          }
        }
      );

      NotificationManager.info(`${updated.firstName} ${updated.lastName} unlinked`);
      
      return updateMemberInList(state, memberId, updated);
    }

    case member_action_types.MEMBER_DATA_RECEIVED:

      NotificationManager.success('Server data loaded');
      //TODO: look for local records that are not on the server.  support offline edits

      const sortMembers = [...action.members]
        .sort(sortComparer(state.sortKey));

      console.log('MEMBER_DATA_RECEIVED');
      return Object.assign({}, state, {
        members: sortMembers,
        dataSource: member_data_sources.API,
        loading: false
      });

    case member_action_types.UPLOAD_DATA_RECEIVED:
      NotificationManager.success('Imported data loaded!');
      const trimIfString = (value) => {
        if(value && typeof value === 'string') return value.trim();
        return value;
      }

      const importData = action.data;
      const fieldMap = action.fieldMap;
      const importNote = action.importNote;

      let tempId =  Math.floor(Date.now()/1000);

      let members = importData.map(record => {


        /*
        Lot
        Address
        Adult Residents
        Alternate Address
        Children
        Email
        First name
        Hobbies
        Home Phone
        Last name
        Mobile Phone
        Office Phone
        Neighborhood
        Opt-In Directory
        Move-In Date
        Originally From
        Passions/Interests
        Profession
        Employer
        Website
        */
        let altAddress = record[fieldMap['Alternate Address']];
        if(altAddress) {
          const parsedAddress = ParseAddress.parseLocation(altAddress);
          /* //Parsed address: '1005 N Gravenstein Hwy Suite 500 Sebastopol, CA'
           { number: '1005',
             prefix: 'N',
             street: 'Gravenstein',
             type: 'Hwy',
             sec_unit_type: 'Suite',
             sec_unit_num: '500',
             city: 'Sebastopol',
             state: 'CA'
           } */
          const street = parsedAddress.prefix ? `${parsedAddress.number} ${parsedAddress.prefix} ${parsedAddress.street} ${parsedAddress.type}` : `${parsedAddress.number} ${parsedAddress.street} ${parsedAddress.type}`
          altAddress = {
            street : street,
            street2: parsedAddress.sec_unit_num ? `${parsedAddress.sec_unit_type} ${parsedAddress.sec_unit_num}` : null,
            city   : parsedAddress.city,
            state  : parsedAddress.state,
            zip    : parsedAddress.zip
          };
        }

        //TODO: log/report bad phone numbers

        let mobilePhone = record[fieldMap['Mobile Phone']] ? new PhoneNumber(record[fieldMap['Mobile Phone']], 'US') : null;
        let homePhone = record[fieldMap['Home Phone']] ? new PhoneNumber(record[fieldMap[fieldMap['Home Phone']]], 'US') : null;
        let officePhone = record[fieldMap['Office Phone']] ? new PhoneNumber(record[fieldMap[fieldMap['Office Phone']]], 'US') : null;

        const member = {
          id: ++tempId,
          firstName:    trimIfString(record[fieldMap['First Name']]),
          lastName:     trimIfString(record[fieldMap['Last Name']]),
          nameSuffix:   trimIfString(record[fieldMap['Name Suffix']]),
          homePhone:    homePhone && homePhone.isValid() ? homePhone.getNumber( 'national' ): null,
          mobilePhone:  mobilePhone && mobilePhone.isValid() ? mobilePhone.getNumber( 'national' ): null,
          officePhone:  officePhone && officePhone.isValid() ? officePhone.getNumber( 'national' ): null,
          email:        trimIfString(record[fieldMap['Email']]),
          neighborhood: trimIfString(record[fieldMap['Neighborhood']]),
          lotCode: trimIfString(record[fieldMap['Lot']]),
          propertyAddress: {
            street: trimIfString(record[fieldMap['Property Address']]),
            city :  communityDefaults.location.city,
            state:  communityDefaults.location.state,
            zip  :  communityDefaults.location.zip
          },
          alternateAddress: altAddress,
          optIn:        record[fieldMap['Opt-In Directory']],
          residentSinceDate: record[fieldMap['Move-In Date']],
          importNote:   importNote
        };

        return member;
      });

      return Object.assign({}, state, {
        members: members,
        dataSource: member_data_sources.CSV_IMPORT,
        importNote
      });
    case member_action_types.UPLOAD_DATA_RECEIVE_MATCH_CHECK:
      const matchResponse = Object.assign({}, action.matchResponse);


      let matchIds = [];
      let duplicateIds = [];
      for(let i=0, l=matchResponse.data.length; i < l; i++) {
        if(!matchResponse.data[i].oldRecord) continue;
        const id = matchResponse.data[i].oldRecord.id;
        if(matchIds.includes(id)) {
          duplicateIds.push(id)
        } else {
          matchIds.push(id);
        }
      }

      /* TODO:  loop through duplicateIds
                collect all matches from response data
                keep the best match (most field matches)
                in the case of a tie, mark as duplicate match
                add that to the display of import proof


      */
      let unresolvedDuplicates = [];
     
      duplicateIds.forEach(id => {
        const dups = matchResponse.data
          .filter(m => m.oldRecord && m.oldRecord.id === id)
          .sort((a, b) => b.matchingFields.length - a.matchingFields.length); // reverse sort.  Most matches to least matches
        if(dups.length < 2) {
          // why is this happneing?
          console.log(`${dups[0].newRecord.firstName} ${dups[0].newRecord.lastName} found in dups list all lonesome like.  WHy?`);

        } else if(dups[0].matchingFields.length > dups[1].matchingFields.length) {
          for(let i=1; i < dups.length; i++){
            const idx = matchResponse.data.findIndex(m => m.newRecord.id === dups[i].newRecord.id);
            matchResponse.data.splice(idx, 1);
          }
        } else {
          unresolvedDuplicates.concat(dups);
        }
      });

      if(unresolvedDuplicates.length > 0) {
        const namesList = unresolvedDuplicates.map(m => `${m.newRecord.firstName} ${m.newRecord.lastName}` );
        NotificationManager.warn(`The system was unable to resolve multiple records that matched the same existing record.  Please resolve questionable matches: ${namesList.join(', ')}`);
      }

      const decoratedMembers = state.members.map((member, i) => {
        const match = matchResponse.data.find(m => m.newRecord.id === member.id) || { matchingFields:[], oldRecord: null};
        return Object.assign(
          member,
          {
            apiMatch: {
              matchingFields: match.matchingFields,
              apiRecord: match.oldRecord,
              validationErrors: match.validationErrors
            }
          }
        )
      });



      return Object.assign({}, state, {
        members: decoratedMembers,
        dataSource: member_data_sources.CSV_IMPORT
      });
    case member_action_types.UPLOAD_PUBLISH:
      console.log('UPLOAD_PUBLISH received...  setting loading to true');
      return Object.assign({}, state, {
        loading: true
      });
      // pass through
    case member_action_types.GET_ALL:
      console.log('GET_ALL received...  setting loading to true');
      return Object.assign({}, state, {
        loading: true
      });

    case member_action_types.UPDATE_FAILURE_RECEIVED:
      const uppErr = action.err;
      console.log(uppErr);
      // when triggered by a throw, accessing the error slows the notification presentation such that it flashes too quickly
      NotificationManager.error(uppErr.message, 'Update failed with error', 15000);
      return Object.assign({}, state, {
        loading: false
      });
    case member_action_types.MEMBER_DATA_FAILED:
      // when triggered by a throw, accessing the error slows the notification presentation such that it flashes too quickly
      NotificationManager.error(action.err.message, 'Server data load failed with error', 15000);
      return Object.assign({}, state, {
        loading: false
      });
    case member_action_types.CANCEL_LOADING:
      NotificationManager.info('loading action cancelled', 'Loading cancelled', 15000);
      return Object.assign({}, state, {
        loading: false
      });
    case member_action_types.MEMBER_SET_SORT:
      const sort = sortComparer(action.sort);
      sortedMembers = state.members.sort(sort);
      return Object.assign({}, state, {
        members: sortedMembers,
        sortKey: action.sort
      });
    case member_action_types.INVITE_MEMBER:
      return Object.assign({}, state, {
        invites_loading: true
      });
    case member_action_types.INVITE_MEMBER_RESPONSE_RECEIVED:
      return Object.assign({}, state, {
        invites: action.inviteResponse,
        invites_loading: false
      });
    case member_action_types.GENERATE_CSV_FROM_MEMBERS:{
      // flatten property address and alt address for csv export
      const flattenedMemberList = action.memberList.map( member => {
        let flattened = {};
        Object.keys(member).forEach(function(key) {
            switch(key)
            {
              case 'propertyAddress': {
                const propAddress = member.propertyAddress;
                Object.keys(propAddress).forEach(function(keyPa) {
                  flattened[keyPa] = propAddress[keyPa];
                });
                break;
              }
              case 'alternateAddress': {
                const altAddress = member.alternateAddress;
                Object.keys(altAddress).forEach(function(keyAa) {
                  flattened[`alt_${keyAa}`] = altAddress[keyAa];
                });
                break;
              }
              /* skip all these */
              case '_id':
              case '__v':
              case 'createdAt':
              case 'inviteCount':
              case 'lastInvitedAt':
              case 'memberUserKey':
              case 'updatedAt':
                break;
              default: {
                flattened[key] = member[key];
                break;
              }
            }
        });
        return flattened;
      });

      const csv = PapaParse.unparse(flattenedMemberList);
      return Object.assign({}, state, {
        csv_member_download: csv
      });
    }

    case member_action_types.CSV_DOWNLOADED:
      return Object.assign({}, state, {
        csv_member_download: null
      });

    case user_action_types.USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};

export default memberApp;
