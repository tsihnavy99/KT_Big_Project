import { createStackNavigator } from '@react-navigation/stack';

import React, {useState, useEffect} from 'react';
import ChatList from '../chat/ChatList';
import Chat from '../chat/ChatScreen';

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const ChatNavigator = ({navigation, route}) => {

    return (
      <Stack.Navigator screenOptions={{headerShown: false, animation:'fade'}}>
        <Stack.Screen name='ChatList' component={ChatList} />
        <Stack.Screen name='Chat' component={Chat} />
      </Stack.Navigator>
    )
}

export default ChatNavigator;