import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';
import {GestureResponderEvent, SafeAreaView} from 'react-native';
import {Svg, Rect} from 'react-native-svg';
import {SquareView} from '@app/components/shared/square.view';
import {randomHeight, randomWidth} from '@app/helpers';
import {CircleView} from './shared/circle.view';
import {TriangleView} from './shared/triangle.view';

interface BaseViewState {
  shapeSpecsList: ShapeSpecs[];
}

interface BaseViewProps {
  types: ShapeType[];
}

class BaseScreen extends React.Component<BaseViewProps, BaseViewState> {
  state: BaseViewState = {
    shapeSpecsList: [],
  };

  onPressLayer = (event: GestureResponderEvent) => {
    const {locationX: x, locationY: y} = event.nativeEvent;
    const height = Math.min(randomHeight(), randomWidth());
    const width = height;

    this.setState(prevState => ({
      shapeSpecsList: [
        ...prevState.shapeSpecsList,
        {
          key: prevState.shapeSpecsList.length + 1,
          x,
          y,
          height,
          width,
          type: this.getShapeType(),
        },
      ],
    }));
  };

  getShapeType = () => {
    const {types} = this.props;
    if (types.length === 1) return types[0];
    const index = Math.floor(Math.random() * types.length);
    return types[index];
  };

  render() {
    const {shapeSpecsList} = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <Svg height="100%" width="100%" onPress={this.onPressLayer}>
          <Rect x="0" y="0" width="100%" height="100%" />
          {shapeSpecsList.map(shapeSpecs => this.renderShape(shapeSpecs))}
        </Svg>
      </SafeAreaView>
    );
  }

  renderShape = (shapeSpecs: ShapeSpecs) => {
    if (shapeSpecs.type === 'square') return <SquareView key={`${shapeSpecs.key}`} shapeSpecs={shapeSpecs} />;
    if (shapeSpecs.type === 'circle') return <CircleView key={`${shapeSpecs.key}`} shapeSpecs={shapeSpecs} />;
    if (shapeSpecs.type === 'triangle') return <TriangleView key={`${shapeSpecs.key}`} shapeSpecs={shapeSpecs} />;
    return null;
  };
}

const withShapeType = (...type: ShapeType[]) => {
  class ShapeScreen extends React.Component<{}, {}> {
    render() {
      return <BaseScreen types={type} />;
    }
  }

  hoistNonReactStatics(ShapeScreen, BaseScreen);
  return ShapeScreen;
};

export const SquareScreen = withShapeType('square');
export const CircleScreen = withShapeType('circle');
export const TriangleScreen = withShapeType('triangle');
export const RandomScreen = withShapeType('square', 'circle', 'triangle');
