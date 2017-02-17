class Auth {

//TODO: fix this shit.  Totally hackable.
  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */
  static getToken () {
    return localStorage.getItem('token');
  }
  /**
   * Check whether a user is in any of the listed roles
   *
   * @param {User} user
   * @param [string] roles
   * @returns {bool} if the user is in any of the roles
   */
  static userIsInRole(user, roles) {

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

  static userCanEditMember(userData, member) {
    if(this.userIsInRole(userData, [this.ROLES.ADMIN])) return true;
    if(userData.memberUserKey && userData.memberUserKey === member.memberUserKey) return true;
    return false;
  }

}

Auth.ROLES = {
  ADMIN: 'administrator'
}

export default Auth;
