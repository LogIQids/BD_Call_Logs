import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home';
import Comment from '../Screens/Comment';
import Users from '../Screens/Messenger';
import Chat from '../Screens/Chat';
import Bottomstack from './bottomstack';

const Stack = createStackNavigator();

export default function StackNavigator(navigation) {

  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Home"
        component={Bottomstack}
        options={{headerShown: false}}
      /> 
      <Stack.Screen
        name="Comment"
        component={Comment}
        options={{headerShown: false,tabBarStyle:{display:'none'}}}
      />
      <Stack.Screen
        name="Users"
        component={Users}
        options={{headerShown: false,tabBarStyle:{display:'none'}}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false,tabBarStyle:{display:'none'}}}
      />
    </Stack.Navigator>
  );
}
