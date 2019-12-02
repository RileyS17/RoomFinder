import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";

const Accordian = props => {

    const [isExpanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        if (isExpanded)
            setExpanded(false);
        else
            setExpanded(true);
    }

    const handleData = () => {
        output = "";
        if (props.data.length > 0) {
            for (x = 0; x < props.data.length; x++) {
                var temp = "Available from " + props.data[x].startTime + " until " + props.data[x].endTime + ".";
                if (x+1 !== props.data.length) {
                    temp = temp.concat("\n");
                }
                output = output.concat(temp);
            }   
        }
        else
            output = "No available time on this day." 
        return <Text style={styles.availFont}>{output}</Text>
    }
    
    //Render function
    return (
        <View>
            <TouchableOpacity style={styles.row} onPress={toggleExpand}>
                <Text style={[styles.title, styles.font]}>{props.title}</Text>
                <Icon name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'#606363'} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {isExpanded &&
                <View style={styles.child}>
                    {handleData()}    
                </View>}
         </View>
    );
};

const styles = StyleSheet.create({
    title:{
        fontSize: 25,
        fontWeight:'bold',
        color: 'black',
    },
    availFont: {
        fontSize: 18,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: '#1eaae6',
    },
    parentHr:{
        height:1,
        color: '#ededed',
        width:'100%'
    },
    child:{
        backgroundColor: '#85e3ff',
        padding:16,
    }
});

export default Accordian;