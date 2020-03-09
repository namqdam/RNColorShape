import {Dimensions} from 'react-native';

export const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

const minHeight = Math.round(screenHeight * 0.1);
const maxHeight = Math.round(screenHeight * 0.45);

const minWidth = Math.round(screenWidth * 0.1);
const maxWidth = Math.round(screenWidth * 0.45);

export const randomHeight = () => {
  return Math.round(Math.random() * (maxHeight - minHeight)) + minHeight;
};

export const randomWidth = () => {
  return Math.round(Math.random() * (maxWidth - minWidth)) + minWidth;
};

export const DOUBLE_TAP_DELAY = 300;
