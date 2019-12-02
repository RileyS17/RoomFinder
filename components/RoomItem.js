import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import ViewRoomInfo from './ViewRoomInfo';

const RoomItem = props => {
    //State controlling view specific room info modal
    const [isViewRoomInfo, setViewRoomInfo] = useState(false);
    //State holding data for room info
    const [roomInfoData, setRoomInfoData] = useState([]);

    //Button handlers for view room info
    const viewRoomInfoHandler = () => {
        getRoomInfo();
        setViewRoomInfo(true);
    }
    const closeViewRoomInfo = () => {
        setViewRoomInfo(false);
    }

    //Get all schedule info for specific room
    const getRoomInfo = async () => { 
        try {
            console.log("http://" + props.thisServerIp + "/rooms/?room=" + props.room);
            let response = await fetch("http://" + props.thisServerIp + "/rooms/?room=" + props.room);
            let responseJson = await response.json();
            const result = Object.keys(responseJson).map(key => ({[key]: responseJson[key]}));
            setRoomInfoData(result);
        } catch (error) {
            Alert.alert('Network Error', 'Could not connect to data server');
            console.log(error);
        }
    }

    //Checks if schedule info passed to this item
    const ifSchedInfo = () => {
        if (typeof props.scheduleStart !== 'undefined' || typeof props.scheduleEnd !== 'undefined')
            return <Text style={styles.timeStyle}>{"Available from " + props.scheduleStart + " to " + props.scheduleEnd }</Text>;
        else
            return false;
    }

    //Render function
    return (
        <View>
            <ViewRoomInfo 
                visible={isViewRoomInfo} 
                onCloseButton={closeViewRoomInfo}
                title={props.room}
                data={roomInfoData}
            />
            <TouchableOpacity style={styles.mainCont} onPress={viewRoomInfoHandler}>
                <View>
                    <Text style={styles.roomStyle}>{props.room}</Text>
                </View>
                <View>
                    {ifSchedInfo()}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainCont: {
        flex: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#85e3ff",
    },
    roomStyle: {
        fontWeight: "bold",
        fontSize: 25,
    },
    timeStyle: {
        fontSize: 15,
    },
});

export default RoomItem;