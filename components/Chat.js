import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, StatusBar, KeyboardAvoidingView } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Platform } from 'react-native';
import CustomActions from './CustomActions';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
const firebase = require('firebase');
require('firebase/firestore');
/**
 * @class chat
 * @requires react
 * @requires react-native
 * @requires react-native-community/netinfo
 * @requires react-native-gifted-chat
 * @requires react-native-keyboard-spacer
 * @requires ./CustomActions
 * @requires react-native-maps
 * @requires firebase
 * @requires firestore
 */

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            user: {
                _id: "",
                name: "",
                avatar: ""
            },
            uid: 0,
            isConnected: false,
            image: null,
            location: null
        };

        /**
         * firestore app configuration
         * @param {string} apiKey
         * @param {string} authDomain
         * @param {string} databaseURL
         * @param {string} projectId
         * @param {string} storageBucket
         * @param {string} messagingSenderId
         * @param {string} appId
         * @param {string} measurementId
         */

        // connect to firestore app
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyC7G0Ks_0XR5H4ICUzWBHaAS3PiQs6zy4Q",
                authDomain: "messageapp-c6b9e.firebaseapp.com",
                databaseURL: "https://messageapp-c6b9e.firebaseio.com",
                projectId: "messageapp-c6b9e",
                storageBucket: "messageapp-c6b9e.appspot.com",
                messagingSenderId: "119011117355",
                appId: "1:119011117355:web:df0e9e21f8e2a528afdd6e",
                measurementId: "G-20T3D2Q4TP"
            });
        }
        ////reference to the collection 'messages
        this.referenceMessages = firebase.firestore().collection("messages");
    }

    /**
   * saves messages to asyncStorage
   * @async
   * @function saveMessages
   * @returns {Promise<string>} The data from the storage 
   */
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }
    /**
    * stores messages in async storage so they are accessible offline
    * @async
    * @function getMessages
    * @return messages
    */
    async getMessages() {
        let messages = '';
        //wrap your logic in try and catch so that any errors will be caught
        //If the promise gets rejected, you’ll receive an error, and the code in catch will be executed
        try {
            //await—here, it’s used to wait for a promise.
            //To read the messages in storage, you’ll use the getItem method, which takes a key
            ////If there's no storage item with that key, then set messages to be empty [].
            messages = await AsyncStorage.getItem('messages') || [];
            //use setState to give messages the saved data
            this.setState({
                //asyncStorage can only store strings, you need to use JSON.parse 
                //to convert the saved string back into an object
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    }
    /**
    * can delete messages from asyncStorage
    * @async
    * @function deleteMessages
    * @param {none}
    */
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }
    /**
     * NetInfo checks to see if the user is online
     * then it uses firebase to authorize user and signin
     * updates the user state with currently active user data
     * get messages saved from the database
     */
    componentDidMount() {
        NetInfo.fetch().then(isConnected => {
            if (isConnected == true) {
                console.log('online');
                this.setState({
                    isConnected: true,
                })
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
                    try {
                        if (!user) {
                            await firebase.auth().signInAnonymously();
                        }
                        //update user state with currently active user data
                        this.setState({
                            uid: user.uid,
                            loggedInText: "helloooooooo",
                            user: {
                                _id: user.uid,
                                name: this.props.route.params.name + " entered the chat",
                                avatar: '',
                            },
                        });

                        // create a reference to the active user's documents (messages)
                        this.referenceMessages = firebase.firestore().collection("messages");
                        // listen for collection changes for current user
                        this.unsubscribeMessager = this.referenceMessages.onSnapshot(this.onCollectionUpdate);
                    } catch (error) {
                        console.log(error.message);
                    }
                });
            } else {
                console.log('offline');
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
    }
    /**
     * @function onSend
     * @param messages 
     * @returns update with new message(s)
     */
    //what will be called when a user sends a message
    onSend(messages = []) {
        //the function setState() is called with the parameter previousState, which is a reference to the component’s state at the time the change is applied
        this.setState(previousState => ({
            //the message a user has just sent gets appended to the state messages so that it can be displayed in the chat.
            messages: GiftedChat.append(previousState.messages, messages)
        }), () => {
            this.addMessage();
            this.saveMessages();
        });
    }

    componentWillUnmount() {
        // stop listening to authentication
        this.authUnsubscribe();
        // stop listening for changes
        this.unsubscribeMessager();
    }
    /**
    * Adds message(s) to the firebase database
    * @function addMessage
    * @param {number} _id
    * @param {string} text
    * @param {date} createdAt
    * @param {object} user
    * @param {object} uid
    * @param {image} image
    * @param {location} location
    */
    addMessage() {
        this.referenceMessages.add({
            _id: this.state.messages[0]._id,
            text: this.state.messages[0].text || '',
            createdAt: this.state.messages[0].createdAt,
            user: this.state.messages[0].user,
            uid: this.state.uid,
            image: this.state.messages[0].image || '',
            location: this.state.messages[0].location || '',
        });
    }
    /**
     * updates firestore collection database whenever 
     * collection is updated/called
     * @function onCollectionUpdate
     * @param {string} _id
     * @param {string} text 
     * @param {date} createdAt
     * @param {object} user
     * @param {image} image 
     * @param {location} location
     */
    onCollectionUpdate = querySnapshot => {
        const messages = [];
        querySnapshot.forEach(doc => {
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text.toString() || '',
                createdAt: data.createdAt,
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                },
                image: data.image || '',
                location: data.location || '',
            });
        });
        this.setState({
            messages
        });
    };

    /**
     * altered Bubble component is returned from GiftedChat
     * @function renderBubble
     * @param {*} props 
     */
    //altered Bubble component is returned from GiftedChat
    renderBubble(props) {
        return (
            <Bubble
                //inheriting props with the ...props keyword
                {...props}
                // given a new wrapperStyle. 
                wrapperStyle={{
                    //The left and right speech bubbles can be targeted by left and right respectively.
                    right: {
                        //black 
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    };
    /**
     * does not render toolbar if internet is not online
     * @function renderInputToolbar
     * @param {*} props
     * @returns {InputToolbar}
     */
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }
    //renderCustomActions function is responsible for creating the circle button
    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };
    /**
     * render map using user coordinates 
     * @function renderCustomView
     * @param {*} props
     * @returns {MapView}
     */
    //function is where you’ll check if the currentMessage contains location data
    renderCustomView(props) {
        const { currentMessage } = props;
        // If the answer is yes, it will return a MapView
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }
    render() {
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;
        //sets the title
        this.props.navigation.setOptions({ title: name });
        //set the background color 
        this.props.navigation.setOptions({ backgroundColor: color });

        return (

            <View style={[styles.container, { backgroundColor: color }]}>

                {/* <StatusBar backgroundColor="blue" barStyle="light-content" /> */}
                {/* Gifted Chat provides its own component & comes with its own props */}

                <GiftedChat
                    //The renderCustomActions function is responsible for creating the circle button
                    renderActions={this.renderCustomActions}
                    inverted={true}
                    //add the prop renderCustomView to your GiftedChat component and let it call a function.
                    renderCustomView={this.renderCustomView}
                    //customizing the renderBubble prop to change bubble color
                    renderBubble={this.renderBubble.bind(this)}
                    //provide GiftedChat with your messages
                    messages={this.state.messages}
                    //tell it what should happen when the user sends a new message; when a user sends a message, the onSend() function is called.
                    onSend={messages => this.onSend(messages)}
                    //information about the sender (user)
                    user={{
                        _id: 1,
                    }}
                />

                {/* shifts the keyboard so you can see what you're typing */}
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
            </View >

        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})