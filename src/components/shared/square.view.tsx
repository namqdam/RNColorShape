import React, {useEffect, useRef, useState} from 'react';
import {Image, Rect} from 'react-native-svg';
import {GestureResponderEvent} from 'react-native';
import {DOUBLE_TAP_DELAY} from '@app/helpers';
import {ColorService} from '@app/services/color.service';

const _SquareView = ({shapeSpecs}: {shapeSpecs: ShapeSpecs}) => {
  const lastTappedTime = useRef(null);
  const [uri, setUri] = useState(null);
  const [fillColor, setFillColor] = useState(null);

  const renewImage = async () => {
    try {
      const imageUri = await ColorService.generateImage();
      setUri(imageUri);
      setFillColor(null);
    } catch (error) {
      setUri(null);
      setFillColor(ColorService.randomColor());
    }
  };

  const onPress = async (event: GestureResponderEvent) => {
    const currentTime = new Date().getTime();

    if (lastTappedTime.current && currentTime - lastTappedTime.current <= DOUBLE_TAP_DELAY) {
      lastTappedTime.current = currentTime;

      renewImage();
      return;
    }

    lastTappedTime.current = currentTime;
  };

  useEffect(() => {
    renewImage();
  }, []);

  if (!uri && !fillColor) return null;
  if (fillColor)
    return (
      <Rect
        x={`${Math.round(shapeSpecs.x - shapeSpecs.width / 2)}`}
        y={`${Math.round(shapeSpecs.y - shapeSpecs.height / 2)}`}
        height={`${shapeSpecs.height}`}
        width={`${shapeSpecs.width}`}
        fill={`${fillColor}`}
        onPress={onPress}
      />
    );
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
