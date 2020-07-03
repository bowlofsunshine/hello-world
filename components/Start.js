import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
const firebase = require('firebase');
require('firebase/firestore');
const image = require('../A5_project_assets/Background_Image.png');
const icon = require('../A5_project_assets/icon.svg');
export default class Screen1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', color: '' };
    }

    render() {
        return (
            <ImageBackground source={image} style={styles.image}>
                <Text style={styles.title}>Chat App</Text>
                <View style={styles.box}>
                    {/* Text input to enter name for chatrooms */}
                    <TextInput style={styles.input}
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        placeholder='Your Name' />
                    <Text style={styles.bgText}>Choose a Background Color</Text>
                    <View style={styles.colorPicker}>
                        {/* circles to choose the color from */}
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="Black background"
                            accessibilityHint="Lets you choose what color is the background."
                            accessibilityRole="button"
                            style={this.state.active1 ? styles.circlePress : styles.circle}
                            // when pressed the state will be set to this color
                            onPress={() => this.setState({ color: '#090C08', active1: !this.state.active1 })}
                        ><View style={[styles.circle, { backgroundColor: '#090C08' }]}>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="Purple background"
                            accessibilityHint="Lets you choose what color is the background."
                            accessibilityRole="button"
                            style={this.state.active2 ? styles.circlePress : styles.circle}
                            onPress={() => this.setState({ color: '#474056', active2: !this.state.active2 })}
                        ><View style={[styles.circle, { backgroundColor: '#474056' }]}>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="Blue background"
                            accessibilityHint="Lets you choose what color is the background."
                            accessibilityRole="button"
                            style={this.state.active3 ? styles.circlePress : styles.circle}
                            onPress={() => this.setState({ color: '#8A95A5', active3: !this.state.active3 })}
                        ><View style={[styles.circle, { backgroundColor: '#8A95A5' }]}>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="Green background"
                            accessibilityHint="Lets you choose what color is the background."
                            accessibilityRole="button"
                            style={this.state.active4 ? styles.circlePress : styles.circle}
                            onPress={() => this.setState({ color: '#B9C6AE', active4: !this.state.active4 })}
                        ><View style={[styles.circle, { backgroundColor: '#B9C6AE' }]}>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chatButton}>
                        <Button
                            //color of the title
                            color='#FFFFFF'
                            title="Start Chattings"
                            //on press will take you to this next screen with the new set states in place 
                            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                        />
                    </View>
                </View>
            </ImageBackground >
        )
    }
}
const styles = StyleSheet.create({
    box: {
        flex: 1,
        backgroundColor: 'white',
        height: '44%',
        width: '88%',
        alignItems: 'center',
        alignSelf: 'center'
    },
    colorPicker: {

        flex: 4,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        width: '80%',
        justifyContent: 'space-around',
        paddingLeft: 16,
        marginTop: 4

    },
    circle: {
        position: 'relative',
        height: 40,
        width: 40,
        borderRadius: 40,
        margin: 2,
        borderWidth: 0,
        borderColor: 'white'

    },
    circlePress: {
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 40,
        borderColor: '#757083',
        borderWidth: 2,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    chatButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: '#757083',
        width: '88%',
        textTransform: 'lowercase',
        marginBottom: 24,
        height: '21%',
        justifyContent: 'center'
    },
    title: {
        flex: 1,
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        alignSelf: 'center',
        marginTop: 44
    },
    input: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 50,
        borderWidth: 1.5,
        borderColor: '#757083',
        borderRadius: 3,
        width: '88%',
        height: '21%',
        marginBottom: 30,
        marginTop: 16,
        paddingLeft: 32,
    },
    bgText: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 100,
        alignSelf: 'flex-start',
        flex: 1,
        width: '88%',
        paddingLeft: 24,
        paddingBottom: 8

    },
})