import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomStack from './bottomstack';
import {useSelector, useDispatch} from 'react-redux';
import Login from '../Screens/Login';
const Stack = createStackNavigator();

export default function StackNavigator() {
  const login = useSelector(state => state.login && state.login.session_token);
  return (
    <NavigationContainer>
      {!login ? (
        <Stack.Navigator mode="modal">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator mode="modal">
          <Stack.Screen
            name="Home"
            component={BottomStack}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
            name="RecipeDetails"
            component={RecipeDetails}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="searchRecipe"
            component={searchRecipe}
            options={{headerShown: false}}
          /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
