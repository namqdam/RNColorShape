import React, {useEffect, useRef, useState} from 'react';
import {GestureResponderEvent} from 'react-native';
import {Circle} from 'react-native-svg';
import {DOUBLE_TAP_DELAY} from '@app/helpers';
import {ColorService} from '@app/services/color.service';

const _CircleView = ({shapeSpecs}: {shapeSpecs: ShapeSpecs}) => {
  const lastTappedTime = useRef(null);
  const [fillColor, setFillColor] = useState('transparent');

  const onPress = async (event: GestureResponderEvent) => {
    const currentTime = new Date().getTime();

    if (lastTappedTime.current && currentTime - lastTappedTime.current <= DOUBLE_TAP_DELAY) {
      lastTappedTime.current = currentTime;

      const color = await ColorService.generateColor();
      setFillColor(color);
      return;
    }

    lastTappedTime.current = currentTime;
  };

  useEffect(() => {
    const fetchColor = async () => {
      const color = await ColorService.generateColor();
      setFillColor(color);
    };
    fetchColor();
  }, []);

  const radius = Math.round((shapeSpecs.height + shapeSpecs.width) / 4);
  return <Circle cx={`${shapeSpecs.x}`} cy={`${shapeSpecs.y}`} r={`${radius}`} fill={fillColor} onPress={onPress} />;
};

export const CircleView = React.memo(_CircleView, (prevProps, nextProps) => {
  return prevProps.shapeSpecs.key === nextProps.shapeSpecs.key;
});
