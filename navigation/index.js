import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
const Stack = createStackNavigator();

export default function StackNavigator() {
  const data = useSelector(state => state.data);
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal">
        {data ? (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
