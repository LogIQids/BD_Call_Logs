import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNav from './HomeNav'
import Create from '../Screens/Create';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Home from '../Screens/Home';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator mode="modal">
      <Tab.Screen
        name="HomeNav"
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          activeTintColor: '#2a52be',
          inactiveTintColor: '#b5b5b5',
          tabBarIcon: ({focused, tintColor}) => {
            return <Icon name="home" style={{padding: 0}} size={25} color={focused?'#2a52be':'#b5b5b5'}/>;
          },
        }}
      />
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          headerShown: false,
          tabBarLabel: 'Create',
          activeTintColor: '#2a52be',
          inactiveTintColor: '#b5b5b5',
          tabBarIcon: ({focused, tintColor}) => {
            return <Icon2 name="create" style={{padding: 0}} size={25} color={focused?'#2a52be':'#b5b5b5'}/>;
          },
        }}
      />
    </Tab.Navigator>
  );
}
