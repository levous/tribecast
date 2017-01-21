# Notes

## Rusty needs to learn

 - How to configure SCSS with webpack so that main.scss loads other \_module.scss files properly
 - How import './path.css' works and webpack config
 - Mocha testing
   - Testing promises chai-as-promised (Bluebird?)
   - Testing in general (walk through memberController, for example, and test all interesting conditions)
 - realtime feedback
   - Tests
   - browser refresh
 - configuration best practices

 webpack:
 //GRRRRRR!  not working.  Hacked by including css link in server/static/index.html but that's not Reacty
 // css is being processed because it blows up when bad font refs are included
 // but nothing applies to DOM
 // tried using js import 'path/to/module.css' and that also blew up but then did nothing.
 // something wrong with webpack

 trying to get react-notifications working from MembershipPage.jsx
