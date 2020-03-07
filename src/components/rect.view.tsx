import React, {useEffect, useState} from 'react';
import {Rect} from 'react-native-svg';
import {ColorService} from '@app/services/color.service';

const _RectView = ({
  loc,
}: {
  loc: {key: string; topLeftX: number; topLeftY: number; height: number; width: number; touchedTime: number};
}) => {
  const [fillColor, setFillColor] = useState('transparent');
  useEffect(() => {
    const fetchColor = async () => {
      const color = await ColorService.generateColor();
      setFillColor(color);
    };
    fetchColor();
  }, [loc.touchedTime]);

  return (
    <Rect
      key={loc.key}
      x={`${loc.topLeftX}`}
      y={`${loc.topLeftY}`}
      height={`${loc.height}`}
      width={`${loc.width}`}
      fill={fillColor}
    />
  );
};

export const RectView = React.memo(_RectView, (prevProps, nextProps) => {
  return prevProps.loc.key === nextProps.loc.key && prevProps.loc.touchedTime === nextProps.loc.touchedTime;
});
