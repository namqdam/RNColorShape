import {ColorResource} from '@app/resources/color.resource';

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777216).toString(16);
};

const generateColor = async () => {
  const colors = await ColorResource.generateColor();
  if (colors.length > 0) return `#${colors[0].hex}`;
  return '#FFFFFF';
};

const generateImage = async () => {
  const patterns = await ColorResource.generatePattern();
  if (patterns.length > 0) return patterns[0].imageUrl;
  return null;
};

export const ColorService = {
  randomColor,
  generateColor,
  generateImage,
};
