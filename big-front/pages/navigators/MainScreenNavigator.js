import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import MainScreen from '../main/MainScreen';
import CameraScreen from '../main/CameraScreen';
import PhotoPreview from '../main/PhotoPreview';
import PrescriptionScreen from '../main/PrescriptionScreen'
import DrugScreen from '../main/DrugScreen';
import InterdictScreen from '../main/InterdictScreen'
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Stack = createStackNavigator();

const MainScreenNavigator = ({navigation, route}) => {

   return (
      <Stack.Navigator screenOptions={{headerShown: false, animation:'fade'}}>
        <Stack.Screen name='MainScreen' component={MainScreen} initialParams={{'userInfo':route.params.userInfo}}/>
        <Stack.Screen name='CameraScreen' component={CameraScreen} />
        <Stack.Screen name='PhotoPreview' component={PhotoPreview} />
        <Stack.Screen name='PrescriptionScreen' component={PrescriptionScreen} />
        <Stack.Screen name='DrugScreen' component={DrugScreen} />
        <Stack.Screen name='InterdictScreen' component={InterdictScreen} />
      </Stack.Navigator>
  )
}

export default MainScreenNavigator;