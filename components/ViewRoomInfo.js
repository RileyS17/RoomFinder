import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';

import Accordian from './Accordian';

const ViewRoomInfo = props => {

    const generateSchedule = () => {
        if (props.data.length > 0) {
            const monday = [];
            const tuesday = [];
            const wednesday = [];
            const thursday = [];
            const friday = [];
            for (x in Object.keys(props.data)) {
                const tempArray = {};
                tempArray['startTime'] = props.data[x][x].start_t;
                tempArray['endTime'] = props.data[x][x].end_t;
                switch(props.data[x][x].day){
                    case 'Monday':
                        monday.push(tempArray);
                        break;
                    case 'Tuesday':
                        tuesday.push(tempArray);
                        break;
                    case 'Wednesday':
                        wednesday.push(tempArray);
                        break;
                    case 'Thursday':
                        thursday.push(tempArray);
                        break;
                    case 'Friday':
                        friday.push(tempArray);
                        break;
                    default:
                        console.log("Error handling days");
                }
            }
            return  <View>
                        <Accordian title="Monday" data={monday}/>
                        <Accordian title="Tuesday" data={tuesday}/>
                        <Accordian title="Wednesday" data={wednesday}/>
                        <Accordian title="Thursday" data={thursday}/>
                        <Accordian title="Friday" data={friday}/>
                    </View>
        }
        else
            return <Text>Loading...</Text>
    }



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
            <View style={styles.schedStyle}>
                {generateSchedule()}
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
        fontWeight: '800',
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
    schedStyle: {
        marginTop: 60,
    }
});

export default ViewRoomInfo;