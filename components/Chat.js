import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { Platform } from 'react-native'

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        messages: [],
    }

    //Example messages for testing
    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello Developer',
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    //system message
                    _id: 2,
                    text: this.props.route.params.name + ' has entered the chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }
    //what will be called when a user sends a message
    onSend(messages = []) {
        //the function setState() is called with the parameter previousState, which is a reference to the component’s state at the time the change is applied
        this.setState(previousState => ({
            //the message a user has just sent gets appended to the state messages so that it can be displayed in the chat.
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
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