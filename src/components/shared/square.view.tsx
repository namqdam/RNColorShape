import React, {useEffect, useRef, useState} from 'react';
import {Image} from 'react-native-svg';
import {GestureResponderEvent} from 'react-native';
import {DOUBLE_TAP_DELAY} from '@app/helpers';
import {ColorService} from '@app/services/color.service';

const _SquareView = ({shapeSpecs}: {shapeSpecs: ShapeSpecs}) => {
  const lastTappedTime = useRef(null);
  const [uri, setUri] = useState(null);

  const onPress = async (event: GestureResponderEvent) => {
    const currentTime = new Date().getTime();

    if (lastTappedTime.current && currentTime - lastTappedTime.current <= DOUBLE_TAP_DELAY) {
      lastTappedTime.current = currentTime;

      const imageUri = await ColorService.generateImage();
      setUri(imageUri);
      return;
    }

    lastTappedTime.current = currentTime;
  };

  useEffect(() => {
    const fetchImage = async () => {
      const imageUri = await ColorService.generateImage();
      setUri(imageUri);
    };
    fetchImage();
  }, []);

  if (!uri) return null;

  return (
    <Image
      x={`${Math.round(shapeSpecs.x - shapeSpecs.width / 2)}`}
      y={`${Math.round(shapeSpecs.y - shapeSpecs.height / 2)}`}
      height={`${shapeSpecs.height}`}
      width={`${shapeSpecs.width}`}
      preserveAspectRatio="xMidYMid slice"
      href={{uri}}
      onPress={onPress}
    />
  );
};

export const SquareView = React.memo(_SquareView, (prevProps, nextProps) => {
  return prevProps.shapeSpecs.key === nextProps.shapeSpecs.key;
});
