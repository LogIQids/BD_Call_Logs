import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeNav from './HomeNav';
import {useSelector, useDispatch} from 'react-redux';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
const Stack = createStackNavigator();

export default function StackNavigator() {
  const login = useSelector(state => state.login && state.login.uid);
  return (
    <NavigationContainer>
      {!login? (
        <Stack.Navigator mode="modal">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator mode="modal">
          <Stack.Screen
            name="Home"
            component={HomeNav}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
