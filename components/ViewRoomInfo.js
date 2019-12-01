import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';

const ViewRoomInfo = props => {
    //Render function
    return (
        <Modal visible={props.visible} animationType="slide">
            <View style={styles.container}>
                <View style={styles.buttonStyle}>
                    <Button title="Close" color="black" onPress={props.onCloseButton} />
                </View>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleText}>{props.title}</Text>
                </View>
            </View>
            <View>
                <Text>Some sort of schedule here</Text>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        alignContent: 'center',
    },
    titleStyle: {
        top: 50,
        flex: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    buttonStyle: {
        top: 50,
        left: 10,
        flex: 30,
        padding: 5,
        justifyContent: 'center',
        backgroundColor: "#1eaae6",
        borderRadius: 10,
    },
});

export default ViewRoomInfo;