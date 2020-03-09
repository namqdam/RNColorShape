import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CircleScreen, RandomScreen, SquareScreen, TriangleScreen} from '@app/components/base.screen';

const AppTabNavigator = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AppTabNavigator.Navigator>
        <AppTabNavigator.Screen name={'Square'} component={SquareScreen} />
        <AppTabNavigator.Screen name={'Circle'} component={CircleScreen} />
        <AppTabNavigator.Screen name={'Triangle'} component={TriangleScreen} />
        <AppTabNavigator.Screen name={'Random'} component={RandomScreen} />
      </AppTabNavigator.Navigator>
    </NavigationContainer>
  );
};
