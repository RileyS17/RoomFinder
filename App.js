import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';

import ShowRoomScreen from './components/ShowRoomScreen';
import EnterServerScreen from './components/EnterServerScreen';

export default function App() {
    //Find Available Room states
    const [isAvailRoomScreen, setAvailRoomScreen] = useState(false);
    const [availRoomData, setAvailRoomData] = useState([]);
    //View Room List states
    const [isViewRoomScreen, setViewRoomScreen] = useState(false);
    const [allRoomsData, setAllRoomsData] = useState([]);
    //Set IP states
    const [isIPScreen, setIPScreen] = useState(false);
    const [serverIP, setServerIP] = useState("192.168.1.58:5000");

    //Button handlers
    const findAvailRoomsHandler = () => {
        getAvailRoomData();
        setAvailRoomScreen(true);
    }
    const closeAvailRoomScreen = () => {
        setAvailRoomScreen(false);
    }
    const viewRoomsHandler = () => {
        getViewRoomData();
        setViewRoomScreen(true);
    }
    const closeViewRoomsScreen = () => {
        setViewRoomScreen(false);
    }
    const setIPHandler = () => {
        setIPScreen(true);
    }
    const closeSetIP = () => {
        setIPScreen(false);
    }
    //Handler for set server IP
    const confirmIpHandler = enteredIp => {
        setServerIP(enteredIp);
    }

    //Get list of rooms currently available + current time period
    const getAvailRoomData = async () => {
        //Converts getDay() to actual day of week
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var dayOfWeek = weekday[new Date().getDay()];
        //Fixes getMinutes so it always returns 2 digits
        var timeMin = new Date().getMinutes();
        if (timeMin < 10) {
            timeMin = "0"+timeMin;
        }
        var curTime = "" + new Date().getHours() + timeMin;

        try {
            console.log("http://" + serverIP + "/rooms/?day=" + dayOfWeek + "&cur_time=" + curTime);
            let response = await fetch("http://" + serverIP + "/rooms/?day=" + dayOfWeek + "&cur_time=" + curTime);
            let responseJson = await response.json();
            const result = Object.keys(responseJson).map(key => ({[key]: responseJson[key]}));
            //Formats result so FlatList can use
            let formatResult = [];
            for (x in Object.keys(responseJson)) {
                let tempArray = {};
                tempArray.room = result[x][x].room;
                tempArray.scheduleStart = result[x][x].start_t;
                tempArray.scheduleEnd = result[x][x].end_t;
                formatResult.push(tempArray);
            }
            setAvailRoomData(formatResult);
        } catch (error) {
            Alert.alert('Network Error', 'Could not connect to data server');
            console.log(error);
        }
    }

    //Get list of all rooms with building groups
    const getViewRoomData = async () => {
        try {
            console.log('http://' + serverIP + '/buildings/rooms');
            let response = await fetch('http://' + serverIP + '/buildings/rooms');
            let responseJson = await response.json();
            const result = Object.keys(responseJson).map(key => ({[key]: responseJson[key]}));
            //Formats result so SectionList can use
            const formatResult = [];
            for (x in Object.keys(responseJson)) {
                const tempArray = {};
                tempArray.title = result[x][x].building;
                tempArray.data = result[x][x].rooms;
                formatResult.push(tempArray);
            }
            setAllRoomsData(formatResult);
        } catch (error) {
            Alert.alert('Network Error', 'Could not connect to data server');
            console.log(error);
        }
    }

    //Render function
    return (
        <View style={styles.container}>
            <View style={styles.setIpStyle}>
                <Button title="Set IP" color={Platform.OS === 'ios' ? "black" : ""} onPress={setIPHandler}/>
            </View>
            <View style={styles.filler}></View>
            <View style={styles.textView}>
                <Text style={styles.titleText}>RoomFinder</Text>
            </View>
            <View style={styles.button}>
                <Button 
                    title="Find Available Rooms" 
                    color={Platform.OS === 'ios' ? "black" : ""} 
                    onPress={findAvailRoomsHandler}
                />
            </View>
            <View style={styles.button}>
                <Button title="View Room List" color={Platform.OS === 'ios' ? "black" : ""} onPress={viewRoomsHandler}/>
            </View>
            <View style={styles.filler}></View>
            <ShowRoomScreen visible={isAvailRoomScreen} onBackButton={closeAvailRoomScreen} dataAvail={availRoomData} thisServerIp={serverIP}/>
            <ShowRoomScreen visible={isViewRoomScreen} onBackButton={closeViewRoomsScreen} dataAll={allRoomsData} thisServerIp={serverIP}/>
            <EnterServerScreen visible={isIPScreen} onBackButton={closeSetIP} currentIp={serverIP} onConfirmIp={confirmIpHandler}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'stretch',
    },
    button: {
        justifyContent: 'space-evenly',
        flex: 2,
        width: "90%",
        margin: 20,
        backgroundColor: "#1eaae6",
        borderRadius: 50,
    },
    textView: {
        flex: 5,
        justifyContent: 'center',
    },
    titleText: {
        fontWeight: '900',
        fontSize: 50,
        marginBottom: 50,
        alignSelf: 'center',
    },
    setIpStyle: {
        justifyContent: 'space-evenly',
        flex: 1,
        marginRight: 20,
        marginTop: 50,
        width: "30%",
        padding: 5,
        alignItems: "center",
        alignSelf: 'flex-end',
        borderRadius: 10,
        backgroundColor: "#1eaae6",
    },
    filler: {
        flex: 6,
    },
});
