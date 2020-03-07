import {generateColor, generatePattern} from '@app/resources/color.resource';

export const ColorService = {
  generateColor: async () => {
    const colors = await generateColor();
    if (colors.length > 0) return `#${colors[0].hex}`;
    return '#FFFFFF';
  },
  generateImage: async () => {
    const patterns = await generatePattern();
    if (patterns.length > 0) return patterns[0].imageUrl;
    return null;
  },
};
