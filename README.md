# React-Native Chat App

A react native app for quick chatting with the ability to send messages, photos and your location. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To run, you must first install expo:

```
npm install expo-cli -g
```

Alternatively you can download Android Studio which you can find here: 
https://developer.android.com/studio

### Installing & Running

The firestore database is currently set up on my acccount. If you would like to change it to be your information, you can change the firebase.initalizeApp({}) in the Chat.js component. 

You will need to install the following dependencies in order for it to run well:

```
npm install --save @react-native-community/netinfo @types/react-native-keyboard-spacer expo-image-picker expo-location expo-permissions firebase prop-types react react-dom react-native react-native-gesture-handler react-native-gifted-chat react-native-keyboard-spacer react-native-maps react-native-web react-navigation react-navigation-stack
```

You will then be able to start the app with expo using

```
npm start
```

When the project is started, a localhost:19002 Metro Bundler page will load. From there you can use the QR code to open expo on your device, or use one of the other simulator options. 


### Once opened in a simulator 

Just type in your name, choose a background color, click 'Start Chatting', and have fun! 