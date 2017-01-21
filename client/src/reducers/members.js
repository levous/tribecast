import {member_action_types} from '../actions/member-actions.js'
import {NotificationManager} from 'react-notifications';

class Member {
  constructor(id, fname, lname, street, city, state, zip){
    this.id = id;
    this.firstName = fname;
    this.lastName = lname;
    this.propertyAddress = {
      street: street,
      city: city,
      state: state,
      zip: zip
    }
  }
}

const members = [
  new Member(666, 'Rusty', 'Brontobones', '3 Swann Rdg','Palmetto', 'GA', '30268'),
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
  new Member(22,'Rosanne', 'Aguirre','17 Olive Court', 'Orland Park', 'IL', '60462'),
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
  members: [members],
  selectedMember: undefined
};

// to start over...
//localStorage.clear();

let memberApp = function(state = initialState, action) {

  switch (action.type) {
    case member_action_types.SELECT_MEMBER:
      return Object.assign({}, state, {
        selectedMember: action.member
      });
    case member_action_types.ADD:
      return Object.assign({}, state, {
        members: [
          ...state.members,
          action.member
        ]
      });

    case member_action_types.UPDATE_SUCCESS_RECEIVED:
      NotificationManager.success(`${action.member.firstName} ${action.member.lastName} Server Saved!`);
      //fall through
    case member_action_types.UPDATE:

      const memberId = action.id || action.member.id;
      // find the index by id
      const actionIndex = state.members.map(function(m) {return m.id; }).indexOf(memberId);
      // assign _id to id if present.  Server is source of record
      if(action.member._id) action.member.id = action.member._id;
      // create a new array, containing updated item, using spread and slice
      return Object.assign({}, state, {
        members: [
          ...state.members.slice(0, actionIndex),
          // ensure unspecified props are not accidentally discarded and that stored object is not mutated
          Object.assign({}, state.members[actionIndex], action.member),
          ...state.members.slice(actionIndex + 1)
        ]
      });
    case member_action_types.MEMBER_DATA_RECEIVED:
      NotificationManager.success('Server data loaded');
      //TODO: look for local records that are not on the server.  support offline edits
      // copy server _id to local id
      action.members.forEach(member => member.id = member._id);
      return Object.assign({}, state, {members: action.members});
    default:
      return state;
  }
};

export default memberApp;
