import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNav from './HomeNav'
import Account from '../Screens/Account';
import Statement from '../Screens/Statement';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator mode="modal">
      <Tab.Screen
        name="Home"
        component={HomeNav}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarLabelStyle: {fontsize: 18, color: '#0D0D0D'},
          tabBarIcon: ({focused, tintColor}) => {
            return <Icon name="home" style={{padding: 0}} size={25} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Account}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {fontsize: 18, color: '#0D0D0D'},
          tabBarIcon: ({focused, tintColor}) => {
            return <Icon2 name="account" style={{padding: 0}} size={25} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
