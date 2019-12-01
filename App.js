import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import ShowRoomScreen from './components/ShowRoomScreen';

export default function App() {
    //Find Available Room states
    const [isAvailRoomScreen, setAvailRoomScreen] = useState(false);
    const [availRoomData, setAvailRoomData] = useState([]);
    //View Room List states
    const [isViewRoomScreen, setViewRoomScreen] = useState(false);
    const [allRoomsData, setAllRoomsData] = useState([]);

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
        if (timeMin.length = 1) {
            timeMin = "0"+timeMin;
        }
        var curTime = "" + new Date().getHours() + timeMin;

        dayOfWeek = "Monday";
        curTime = "1351";
        try {
            let response = await fetch("http://192.168.1.58:5000/rooms/?day=" + dayOfWeek + "&cur_time=" + curTime);
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
            console.error(error);
        }
    }
    //Get list of all rooms with building groups
    const getViewRoomData = async () => {
        try {
            let response = await fetch('http://192.168.1.58:5000/buildings/rooms');
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
            console.error(error);
        }
    }

    //Render function
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.titleText}>RoomFinder</Text>
            </View>
            <View style={styles.button}>
                <Button title="Find Available Rooms" color="black" onPress={findAvailRoomsHandler}/>
            </View>
            <View style={styles.button}>
                <Button title="View Room List" color="black" onPress={viewRoomsHandler}/>
            </View>
            <ShowRoomScreen visible={isAvailRoomScreen} onBackButton={closeAvailRoomScreen} dataAvail={availRoomData}/>
            <ShowRoomScreen visible={isViewRoomScreen} onBackButton={closeViewRoomsScreen} dataAll={allRoomsData}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: "90%",
        margin: 20,
        backgroundColor: "#1eaae6",
        borderRadius: 50,
    },
    titleText: {
        fontWeight: '900',
        fontSize: 40,
        marginBottom: 50,
    },
});
