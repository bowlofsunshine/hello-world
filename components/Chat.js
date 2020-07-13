import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, StatusBar, InputToolbar } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Platform } from 'react-native'
const firebase = require('firebase');
require('firebase/firestore');

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
        };
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

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

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

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
        } catch (error) {
            console.log(error.message);
        }
    }
    //Example messages for testing
    componentDidMount() {
        NetInfo.fetch().then(isConnected => {
            if (isConnected == true) {
                console.log('online');
                this.setState({
                    isConnected: true,
                })
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
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
                });
            } else {
                console.log('offline');
                this.setState({
                    isConnected: false,
                });
                this.getMessages();
            }
        });
        // this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
        //     if (!user) {
        //         user = await firebase.auth().signInAnonymously();
        //     }

        //     // update user state with currently active user data
        //     this.setState({

        //         uid: user.uid,
        //         loggedInText: "Helloooooo"
        //     });

        //     this.unsubscribe = this.referenceMessages.onSnapshot(
        //         this.onCollectionUpdate);
        // });

        // this.setState({
        //     messages: [
        //         {
        //             _id: 1,
        //             text: "Hello Developer",
        //             createdAt: new Date(),
        //             user: {
        //                 _id: 2,
        //                 name: "React Native",
        //                 avatar: "https://placeimg.com/140/140/any"
        //             }
        //         },
        //         {
        //             _id: 2,
        //             text: this.props.route.params.name + " entered the chat",
        //             createdAt: new Date(),
        //             system: true
        //         }
        //     ]
        // });

        // //create a reference to the active user's documents (messages)
        // this.referenceMessages = firebase.firestore().collection('messages').where("uid", "==", this.state.uid);

        // // listen for collection changes for current user
        // this.unsubscribeListUser = this.referenceMessages.onSnapshot(this.onCollectionUpdate);

    }

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
    addMessage() {
        this.referenceMessages.add({
            _id: this.state.messages[0]._id,
            text: this.state.messages[0].text,
            createdAt: this.state.messages[0].createdAt,
            user: this.state.messages[0].user,
            uid: this.state.uid
        });
    }

    onCollectionUpdate = querySnapshot => {
        const messages = [];
        querySnapshot.forEach(doc => {
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text.toString(),
                createdAt: data.createdAt,
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar
                }
            });
            console.log(data.createdAt);
        });
        this.setState({
            messages
        });
    };

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