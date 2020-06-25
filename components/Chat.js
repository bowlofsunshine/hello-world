import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {

    render() {
        let name = this.props.route.params.name;
        let color = this.props.route.params.color; // OR ...
        // let { name } = this.props.route.params;
        //sets the title
        this.props.navigation.setOptions({ title: name });
        //set the background color 
        this.props.navigation.setOptions({ backgroundColor: color });

        return (
            <View style={[styles.container, { backgroundColor: color }]}>
                <Text style={{ color: 'white' }}>This is where you'll chat</Text>
            </View >
        );
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})