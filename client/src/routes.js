import Base from './containers/Base.jsx';
import HomePage from './containers/HomePage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import MembershipPage from './containers/MembershipPage.jsx';
import UploadPage from './containers/UploadPage.jsx';
import NotFound from './containers/NotFound.jsx';
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
