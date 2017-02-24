import Base from './containers/Base';
import HomePage from './containers/HomePage';
import DashboardPage from './containers/DashboardPage';
import LoginPage from './containers/LoginPage';
import SignUpPage from './containers/SignUpPage';
import MembershipPage from './containers/MembershipPage';
import UploadPage from './containers/UploadPage';
import NotFound from './containers/NotFound';
import Auth from './modules/Auth';
import configureStore from './store/configureStore';

//TODO: convert to use https://medium.com/the-many/adding-login-and-authentication-sections-to-your-react-or-react-native-app-7767fd251bd1#.huz2nvz0j
const auth = new Auth(configureStore());

const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [
    {
      path: '/',
      getComponent: (location, callback) => {
        if (auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
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
      path: '/upload',
      component: UploadPage
    },
    {
      path: '/*',
        component: NotFound
    }
  ]
};

export default routes;
