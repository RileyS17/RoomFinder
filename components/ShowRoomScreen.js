import React from 'react';
import { View, StyleSheet, Modal, Button, FlatList, SafeAreaView, Text, SectionList } from 'react-native';

import RoomItem from './RoomItem';

const ShowRoomScreen = props => {
    //Handles type/format of data displayed
    const checkProvidedData = () => {
        if (typeof props.dataAll !== 'undefined') {
            if (props.dataAll.length > 0) {
                return <SectionList sections={props.dataAll}
                                    renderItem={({ item }) => ( <RoomItem room={item} thisServerIp={props.thisServerIp}/> )}
                                    renderSectionHeader={({ section: { title } }) => (<View><Text style={styles.sectionHeader}>{title}</Text></View>)}
                                    keyExtractor={(item, index) => item + index}
                        />
            }
            else
                return <Text>Loading...</Text>
        }
        else if (typeof props.dataAvail !== 'undefined'){
            if (props.dataAvail.length > 0) {
                return <FlatList    data={props.dataAvail} 
                                    renderItem={({ item }) =>  
                                                    <RoomItem room={item.room} scheduleStart={item.scheduleStart} scheduleEnd={item.scheduleEnd} thisServerIp={props.thisServerIp}/>
                                                } 
                                    keyExtractor={item => item.room}
                        />
            }
            else
                return <Text>Loading...</Text>
        }else
            return <Text>Error in passing data</Text>
    }

    //Render function
    return (
        <Modal visible={props.visible} animationType="slide">
            <View style={styles.buttonStyle}>
                <Button title="Back" color="black" onPress={props.onBackButton} />
            </View>
            <SafeAreaView style={styles.listStyle}>
                {checkProvidedData()}
            </SafeAreaView>
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
    listStyle: {
        marginTop: 60,
        flex: 1,
        marginHorizontal: 25,
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 40,
        backgroundColor: 'white',
    }
});

export default ShowRoomScreen;