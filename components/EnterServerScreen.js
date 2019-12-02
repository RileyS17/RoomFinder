import React, { useState} from 'react';
import { View, StyleSheet, Modal, Button, TextInput, Platform } from 'react-native';

const EnterServerScreen = props => {

    const [enteredIp, setIpInput] = useState("");

    const ipInputHandler = enteredValue => {
        setIpInput(enteredValue);
    }
    const backButtonHandler = () => {
        props.onBackButton();
    }
    const confirmButtonHandler = () => {
        props.onConfirmIp(enteredIp);
        props.onBackButton();
    }

    //Render function
    return (
        <Modal visible={props.visible} animationType="slide">
            <View style={styles.buttonStyle}>
                <Button title="Back" color={Platform.OS === 'ios' ? "black" : ""} onPress={backButtonHandler} />
            </View>
            <View style={styles.mainView}>
                <View style={styles.inputView}>
                    <TextInput 
                        style={styles.input}
                        placeholder={props.currentIp}
                        autoFocus={true}
                        onChangeText={ipInputHandler}
                        value={enteredIp}
                    />
                </View>
                <View style={styles.confirmButton}>
                    <Button title="Confirm" color={Platform.OS === 'ios' ? "black" : ""} onPress={confirmButtonHandler}/>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        left: 10,
        top: 50,
        width: "30%",
        padding: 5,
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#1eaae6",
    },
    confirmButton: {
        width: "30%",
        padding: 5,
        alignItems: "center",
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: "#1eaae6",
        margin: 30,
    },
    inputView: {
        marginTop: 80,
    },
    mainView: {
        marginTop: 50,
        flex: 1,
    },
    input: {
        borderWidth: 1,
        width: "80%",
        alignSelf: 'center',
        fontSize: 18,
        padding: 5,
    },
});

export default EnterServerScreen;