import React from 'react';
import { View, Text, Button, ImageBackground, StyleSheet } from 'react-native';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
                <Text style={styles.title}>App Title</Text>
                <View style={styles.box}>
                    <TextInput style={styles.input}
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        placeholder='Your Name' />
                    <Text style={styles.bgText}>Choose a Background Color</Text>
                    <View style={styles.colorPicker}>
                        <TouchableWithoutFeedback
                            style={[styles.circle, { backgroundColor: '#090C08' }]}
                            onPress={() => this.setState({ color: '#090C08' })}
                        />
                        <TouchableWithoutFeedback
                            style={[styles.circle, { backgroundColor: '#474056' }]}
                            onPress={() => this.setState({ color: '#474056' })}
                        />
                        <TouchableWithoutFeedback
                            style={[styles.circle, { backgroundColor: '#8A95A5' }]}
                            onPress={() => this.setState({ color: '#8A95A5' })}
                        />
                        <TouchableWithoutFeedback
                            style={[styles.circle, { backgroundColor: '#B9C6AE' }]}
                            onPress={() => this.setState({ color: '#B9C6AE' })}
                        />
                    </View>
                    <View style={styles.chatButton}>
                        <Button
                            color='#FFFFFF'
                            title="Start Chattings"
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
        width: '88%',
        paddingLeft: 16
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 70,
        margin: 10
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

    },
})