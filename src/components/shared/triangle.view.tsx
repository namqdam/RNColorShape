import React, {useEffect, useRef, useState, forwardRef, useImperativeHandle} from 'react';
import {GestureResponderEvent} from 'react-native';
import {Defs, ClipPath, Image, Rect, G, Polygon} from 'react-native-svg';
import {DOUBLE_TAP_DELAY} from '@app/helpers';
import {ColorService} from '@app/services/color.service';

const _TriangleView = ({shapeSpecs}: {shapeSpecs: ShapeSpecs}) => {
  const maskRef = useRef<any>();
  const lastTappedTime = useRef(null);

  // const [lastTappedTime, setLastTappedTime] = useState(null);
  const [type, setType] = useState(Math.floor(Math.random() * 2));

  const onPress = async (event: GestureResponderEvent) => {
    const currentTime = new Date().getTime();

    if (lastTappedTime.current && currentTime - lastTappedTime.current <= DOUBLE_TAP_DELAY) {
      lastTappedTime.current = currentTime;
      maskRef.current && (await maskRef.current!.update());
      setType(Math.floor(Math.random() * 2));
      return;
    }

    lastTappedTime.current = currentTime;
  };

  return (
    <G>
      <Defs>
        <ClipPath id={`clip${shapeSpecs.key}`}>
          <Polygon
            points={`${shapeSpecs.x},${shapeSpecs.y - (shapeSpecs.height * 2) / 3} 
              ${shapeSpecs.x - shapeSpecs.width / 2},${shapeSpecs.y + shapeSpecs.height / 3} 
              ${shapeSpecs.x + shapeSpecs.width / 2},${shapeSpecs.y + shapeSpecs.height / 3}`}
          />
        </ClipPath>
      </Defs>
      {type === 0 && <ImageMask ref={maskRef} maskKey={shapeSpecs.key} onPress={onPress} />}
      {type === 1 && <ColorMask ref={maskRef} maskKey={shapeSpecs.key} onPress={onPress} />}
    </G>
  );
};

const ImageMask = forwardRef(
  ({maskKey, onPress}: {maskKey: number; onPress: (event: GestureResponderEvent) => void}, ref) => {
    const [uri, setUri] = useState(null);

    useEffect(() => {
      const fetchImage = async () => {
        const imageUri = await ColorService.generateImage();
        setUri(imageUri);
      };
      fetchImage();
    }, []);

    useImperativeHandle(ref, () => ({
      async update() {
        const imageUri = await ColorService.generateImage();
        setUri(imageUri);
      },
    }));

    if (!uri) return null;

    return (
      <Image
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        href={{uri}}
        clipPath={`url(#clip${maskKey})`}
        onPress={onPress}
      />
    );
  },
);

const ColorMask = forwardRef(
  ({maskKey, onPress}: {maskKey: number; onPress: (event: GestureResponderEvent) => void}, ref) => {
    const [fillColor, setFillColor] = useState('transparent');

    useEffect(() => {
      const fetchColor = async () => {
        const color = await ColorService.generateColor();
        setFillColor(color);
      };
      fetchColor();
    }, []);

    useImperativeHandle(ref, () => ({
      async update() {
        const color = await ColorService.generateColor();
        setFillColor(color);
      },
    }));
    return (
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={fillColor}
        clipPath={`url(#clip${maskKey})`}
        onPress={onPress}
      />
    );
  },
);

export const TriangleView = React.memo(_TriangleView, (prevProps, nextProps) => {
  return prevProps.shapeSpecs.key === nextProps.shapeSpecs.key;
});
