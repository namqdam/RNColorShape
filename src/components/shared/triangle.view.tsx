import React, {useEffect, useRef, useState, forwardRef, useImperativeHandle} from 'react';
import {GestureResponderEvent} from 'react-native';
import {Defs, ClipPath, Image, Rect, G, Polygon} from 'react-native-svg';
import {DOUBLE_TAP_DELAY} from '@app/helpers';
import {ColorService} from '@app/services/color.service';

const _TriangleView = ({shapeSpecs}: {shapeSpecs: ShapeSpecs}) => {
  const maskRef = useRef<any>();
  const lastTappedTime = useRef(null);
  const [type, setType] = useState(Math.floor(Math.random() * 2));

  const onPress = async (event: GestureResponderEvent) => {
    const currentTime = new Date().getTime();

    if (lastTappedTime.current && currentTime - lastTappedTime.current <= DOUBLE_TAP_DELAY) {
      lastTappedTime.current = currentTime;
      const newType = Math.floor(Math.random() * 2);
      if (type === newType) {
        maskRef.current && (await maskRef.current!.update());
      } else {
        setType(newType);
      }
      return;
    }

    lastTappedTime.current = currentTime;
  };

  return (
    <>
      <Defs>
        <ClipPath id={`clip${shapeSpecs.key}`}>
          <Polygon
            points={`${shapeSpecs.x},${shapeSpecs.y - (shapeSpecs.height * 2) / 3} 
              ${shapeSpecs.x - shapeSpecs.width / 2},${shapeSpecs.y + shapeSpecs.height / 3} 
              ${shapeSpecs.x + shapeSpecs.width / 2},${shapeSpecs.y + shapeSpecs.height / 3}`}
          />
        </ClipPath>
      </Defs>
      {type === 0 && <ImageMask ref={maskRef} maskKey={shapeSpecs.key} />}
      {type === 1 && <ColorMask ref={maskRef} maskKey={shapeSpecs.key} />}
      <Polygon
        points={`${shapeSpecs.x},${shapeSpecs.y - (shapeSpecs.height * 2) / 3} 
            ${shapeSpecs.x - shapeSpecs.width / 2},${shapeSpecs.y + shapeSpecs.height / 3} 
            ${shapeSpecs.x + shapeSpecs.width / 2},${shapeSpecs.y + shapeSpecs.height / 3}`}
        fill={'transparent'}
        onPress={onPress}
        pointerEvents={'auto'}
      />
    </>
  );
};

const ImageMask = forwardRef(({maskKey}: {maskKey: number}, ref) => {
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

  useEffect(() => {
    renewImage();
  }, []);

  useImperativeHandle(ref, () => ({
    async update() {
      renewImage();
    },
  }));

  if (!uri && !fillColor) return null;
  if (fillColor)
    return (
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill={`${fillColor}`}
        clipPath={`url(#clip${maskKey})`}
        pointerEvents={'none'}
      />
    );

  return (
    <Image
      x="0"
      y="0"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      href={{uri}}
      clipPath={`url(#clip${maskKey})`}
      pointerEvents={'none'}
    />
  );
});

const ColorMask = forwardRef(({maskKey}: {maskKey: number}, ref) => {
  const [fillColor, setFillColor] = useState('transparent');

  const renewColor = async () => {
    try {
      const color = await ColorService.generateColor();
      setFillColor(color);
    } catch (error) {
      setFillColor(ColorService.randomColor());
    }
  };
  useEffect(() => {
    renewColor();
  }, []);

  useImperativeHandle(ref, () => ({
    async update() {
      renewColor();
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
      pointerEvents={'none'}
    />
  );
});

export const TriangleView = React.memo(_TriangleView, (prevProps, nextProps) => {
  return prevProps.shapeSpecs.key === nextProps.shapeSpecs.key;
});
