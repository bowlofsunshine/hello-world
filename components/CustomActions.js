//With PropTypes, you can define what the props you send to a component should look like.
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MapView } from 'react-native-maps';

const firebase = require('firebase');

export default class CustomActions extends React.Component {
    constructor() {
        super();
    }

    pickImage = async () => {
        //ask the user for permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        try {
            //If the user grants you access to their device’s gallery, this function will return the string granted
            if (status === 'granted') {
                //after granted call launchImageLibraryAsync to let them pick a file
                let result = await ImagePicker.launchImageLibraryAsync({
                    //the user should choose only from their images.'all' would allow videos as well. 
                    mediaTypes: 'Images',
                }).catch(error => console.log(error));

                if (!result.cancelled) {
                    //returns an object containing a uri to the media file along with its width, height, and file type.
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl })
                }

            }
        } catch (error) {
            console.log(error.message);
        }
    }

    takePhoto = async () => {
        //ask the user for permission
        const { status } = await Permissions.askAsync(
            Permissions.CAMERA,
            Permissions.CAMERA_ROLL
        );
        try {
            //If the user grants you access to their device’s gallery & camera, this function will return the string granted
            if (status === 'granted') {
                //after granted call launchCameraAsync to have the camera to open for a photo 
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: 'Images',
                }).catch(error => console.log(error));

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }

            }
        } catch (error) {
            console.log(error.message);
        }
    }

    getLocation = async () => {
        try {
            //ask the user for permission
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            ////If the user grants you access to their device’s location, this function will return the string granted
            if (status === 'granted') {
                //after granted call getCurrentPositionAsync to have the location be sent
                let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));

                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        try {
            //used to hand down data (the options you want to display) to the ActionSheet component.
            //Before you can use this.context, however, you have to create an object to define this context typ
            this.context.actionSheet().showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                },
                async (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            console.log('user wants to pick an image');
                            return this.pickImage();
                        case 1:
                            console.log('user wants to take a photo');
                            return this.takePhoto();
                        case 2:
                            console.log('user wants to get their location');
                            return this.getLocation();
                        default:
                    }
                },
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    uploadImage = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = (() => {
                resolve(xhr.response);
            });
            xhr.onerror = ((e) => {
                console.log(e);
                reject(new TypeError('NETWORK REQUEST FAILED'));
            });
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const getImageName = uri.split('/');
        const imageArrayLength = getImageName.length - 1;
        const ref = firebase.storage().ref().child(getImageName[imageArrayLength]);
        console.log(ref, getImageName[imageArrayLength]);
        const snapshot = await ref.put(blob);

        blob.close();

        //to retrieve the image url
        const imageURL = await snapshot.ref.getDownloadURL();
        return imageURL;
    }

    render() {
        return (
            //When the user clicks the button, you’ll want to call the onActionPress function, which displays the options of taking a photo, selecting a photo, or sharing a location.
            <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
                {/* //Inside the touchable, add a View that you’ll style to look like a circle. Within this View, add the necessary text to display the “+” symbol: */}
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
                {/* When the user presses the button in the input field, onActionPress is called, which creates an ActionSheet that displays a set of defined actions */}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
})
CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};