import {
  green900,
  cyan700,
  pinkA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

const MuiTheme = getMuiTheme({
  palette: {
    primary1Color: green900,
    primary2Color: cyan700
  },
  tabs: {
    backgroundColor: fade(green900, 0.3)
  },
  flatButton: {
    color: fade(white, 0.3),
    border: 'solid 1px white'
  },
  raisedButton: {
    primaryColor:  fade(green900, 0.5)
  },
  floatingActionButton: {
    secondaryColor: fade(green900, 0.5)
  }
});

export default MuiTheme;

/*{
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};*/
