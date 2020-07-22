import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, ImageBackground } from 'react-native';
// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';
import CustomActions from './components/CustomActions';
import KeyboardSpacer from 'react-native-keyboard-spacer'
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

/**
 * @class HelloWorld
 * @requires react
 * @requires react-native
 * @requires react-native-gesture-handler
 * @requires firebase
 * @requires firestore
 * @requires Start
 * @requires Chat
 * @requires @react-navigation/native
 * @requires @react-navigation/stack
 */

export default class HelloWorld extends Component {

  render() {
    return (

      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>


    );
  }
}

const styles = StyleSheet.create({

})
