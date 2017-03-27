import * as userActions from '../actions/user-actions';
import * as memberActions from '../actions/member-actions';

class Auth {

//TODO: fix this shit.  Totally hackable.

  constructor(store) {
    this.store = store;
    this.userData = (store && store.getState().userApp.userData) || null;
  }
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  authenticateUser(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Check if a user is authorized to view the directory
   *
   * @returns {boolean}
   */
  isUserAuthorizedToView() {
    //TODO: use roles to grant access to 'Read' directory.  Perhaps 'Reader'?
    return this.isUserAuthenticated();
  }

  /**
   * Check if a user is an administrator
   *
   * @returns {boolean}
   */
  isUserAdmin() {
    return this.userIsInRole(this.userData, [Auth.ROLES.ADMIN]);
  }


  /**
   * Return the name of a user if authenticated.  Null if not authenticated.
   *
   * @returns {string}
   */
  loggedInUserName() {
    if (!this.isUserAuthenticated()) return null;
    try {
      return this.userData.name
    }catch(err){
      return null
    };
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  deauthenticateUser() {
    localStorage.removeItem('token');
    // clear it all!  We were still able to view records after logging out
    debugger;
    this.store.dispatch(userActions.userLoggedOut());
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */
  getToken () {
    return localStorage.getItem('token');
  }
  /**
   * Check whether a user is in any of the listed roles
   *
   * @param {User} user
   * @param [string] roles
   * @returns {bool} if the user is in any of the roles
   */
  userIsInRole(user, roles) {

    // sanity check roles (no roles then not secured)
    if(!roles || roles.length === 0) return true;
    // sanity check user and roles (no user or roles than not authorized)
    if(!user || !user.roles || user.roles.length === 0) return false;

    for(let roleIdx = 0; roleIdx < roles.length; roleIdx++) {
      for(let userRoleIdx = 0; userRoleIdx < user.roles.length; userRoleIdx++) {
        // matching role / user role
        if(user.roles[userRoleIdx] === roles[roleIdx]) return true;
      }
    }
    // no match
    return false;
  }

  userCanEditMember(userData, member) {
    if(!userData || !member) return false;
    if(this.store.getState().memberApp.dataSource !== memberActions.member_data_sources.API) return false;
    if(this.userIsInRole(userData, [Auth.ROLES.ADMIN])) return true;
    if(userData.memberUserKey && userData.memberUserKey === member.memberUserKey) return true;
    return false;
  }

}

Auth.ROLES = {
  ADMIN: 'administrator'
}

export default Auth;
