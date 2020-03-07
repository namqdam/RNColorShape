import React from 'react';
import {View, PanResponder} from 'react-native';
import {Svg} from 'react-native-svg';
import {RectView} from '@app/components/rect.view';
import {randomHeight, randomWidth} from '@app/helpers';

const DOUBLE_TAP_DELAY = 300;

interface HomeViewState {
  locs: TapLoc[];
}

export class HomeView extends React.Component<any, HomeViewState> {
  private lastTapTime = undefined;
  private lastPos = undefined;

  private panResponser = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => {
      const {pageX: x, pageY: y} = evt.nativeEvent;
      const height = Math.min(randomHeight(), randomWidth());
      const width = height;

      const overlappedReceiverIndex = this.state.locs.findIndex(loc => {
        return loc.topLeftX <= x && loc.topLeftY <= y && loc.rightBottomX >= x && loc.rightBottomY >= y;
      });

      if (overlappedReceiverIndex > -1) return;

      this.setState(prevState => ({
        locs: [
          ...prevState.locs,
          {
            key: prevState.locs.length + 1,
            topLeftX: Math.round(x - width / 2),
            topLeftY: Math.round(y - height / 2),
            rightBottomX: Math.round(x + width / 2),
            rightBottomY: Math.round(y + height / 2),
            height,
            width,
            touchedTime: new Date().getTime(),
          },
        ],
      }));
    },
    onPanResponderMove: (evt, gestureState) => {},
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      const currentTime = new Date().getTime();

      if (this.lastTapTime && currentTime - this.lastTapTime <= DOUBLE_TAP_DELAY) {
        if (
          Math.abs(evt.nativeEvent.pageX - this.lastPos.x) < 5 &&
          Math.abs(evt.nativeEvent.pageY - this.lastPos.y) < 5
        ) {
          this.lastTapTime = undefined;
          this.lastPos = undefined;
          this.handleDoubleTap(evt);
          return;
        }
      }

      this.lastTapTime = currentTime;
      this.lastPos = {x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY};
    },
    onPanResponderTerminate: (evt, gestureState) => {},
    onShouldBlockNativeResponder: (evt, gestureState) => true,
  });

  state = {
    locs: [],
  };

  handleDoubleTap = evt => {
    const {pageX: x, pageY: y} = evt.nativeEvent;

    this.setState(prevState => {
      const overlappedReceivers = prevState.locs.filter(loc => {
        return loc.topLeftX <= x && loc.topLeftY <= y && loc.rightBottomX >= x && loc.rightBottomY >= y;
      });

      const latestReceiverKey = overlappedReceivers.reduce((latestKey, loc) => {
        return Math.max(latestKey, loc.key);
      }, 0);

      return {
        locs: prevState.locs.map(loc => {
          if (loc.key === latestReceiverKey) return {...loc, touchedTime: new Date().getTime()};
          return loc;
        }),
      };
    });
  };

  render() {
    const {locs} = this.state;

    return (
      <View style={{flex: 1}} {...this.panResponser.panHandlers}>
        <Svg height="100%" width="100%">
          {locs.map(loc => {
            return <RectView key={`${loc.key}`} loc={loc} />;
          })}
        </Svg>
      </View>
    );
  }
}
