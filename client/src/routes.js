import Base from './containers/Base';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';
import MemberProfilePage from './containers/MemberProfilePage';
import MembershipPage from './containers/MembershipPage';
import UploadPage from './containers/UploadPage';
import NotFound from './containers/NotFound';
import Auth from './modules/Auth';

//TODO: convert to use https://medium.com/the-many/adding-login-and-authentication-sections-to-your-react-or-react-native-app-7767fd251bd1#.huz2nvz0j

const routes = store => {
  const auth = new Auth(store);
  return {
    // base component (wrapper for the whole application).
    component: Base,
    childRoutes: [
      {
        path: '/',
        getComponent: (location, callback) => {
          if (auth.isUserAuthenticated()) {
            callback(null, MembershipPage);
          } else {
            callback(null, HomePage);
          }
        }
      },
      {
        path: '/login',
        component: LoginPage
      },
      {
        path: '/signup',
        component: SignUpPage
      },
      {
        path: '/logout',
        onEnter: (nextState, replace) => {
          auth.deauthenticateUser();

          // change the current URL to /
          replace('/');
        },
      },
      {
        path: '/membership',
        component: MembershipPage
      },
      {
        path: '/profile',
        component: MemberProfilePage
      },
      {
        path: '/upload',
        component: UploadPage
      },
      {
        path: '/*',
          component: NotFound
      }
    ]
  };
};

export default routes;
