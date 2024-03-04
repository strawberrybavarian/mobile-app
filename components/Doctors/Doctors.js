import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Doctors =()=>{
    return (
      <>
      <View style={styles.container}>
         <Text style={styles.titleText}> Doctors </Text>
         <Image
          style={styles.magni}
          contentFit="cover"
          source={require("../assets/magni.png")}
        />
         <Image
          style={[styles.filter]}
          contentFit="cover"
          source={require("../assets/filter.png")}
        /> 
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.button1}>
        <Text style={styles.buttonText}>General</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1}>
        <Text style={styles.buttonText}>Dentist</Text>
        </TouchableOpacity>
       </View>

       <View style={{flexDirection:'row', alignItems:'center'}}>
       <TouchableOpacity style={styles.box1}>
        <Text style={styles.buttonText}>Dr. Ana Santos </Text>
        <Text style={styles.buttonText1}>NeuroSurgeon/Apex </Text>
        <Image
        style={[styles.filter1]}
        contentFit="cover"
        source={require("../assets/Doc.png")}/> 
        </TouchableOpacity>
       </View>
       <View style={{flexDirection:'row', alignItems:'center'}}>
       <TouchableOpacity style={styles.box1}>
        <Text style={styles.buttonText}>Dr. Ana Santos </Text>
        <Text style={styles.buttonText1}>NeuroSurgeon/Apex </Text>
        <Image
        style={[styles.filter1]}
        contentFit="cover"
        source={require("../assets/Doc.png")}/> 
        </TouchableOpacity>
       </View>
       <View style={{flexDirection:'row', alignItems:'center'}}>
       <TouchableOpacity style={styles.box1}>
        <Text style={styles.buttonText}>Dr. Ana Santos </Text>
        <Text style={styles.buttonText1}>NeuroSurgeon/Apex </Text>
        <Image
        style={[styles.filter1]}
        contentFit="cover"
        source={require("../assets/Doc.png")}/> 
        </TouchableOpacity>
       </View>
      </>
       
    );
};

const styles =  StyleSheet.create({
    container: {
        flex:1,
        padding:16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    container1: {
      flex:2,
      width:'100%',
      padding:16,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
  },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 10,
    },
    magni: {
        marginBottom: 10,
        padding: 25,
        height: 30,
        width: 30,
        right: '20%',
        position: "absolute",
    },
    filter: {
        marginBottom: 10,
        padding: 25,
        height: 30,
        width: 30,
        left: '80%',
        position: "absolute",
    },
    filter1: {
      marginBottom: 10,
      padding: 25,
      height: 40,
      width: 30,
      left: '80%',
      position: "absolute",
  },
    button: {
        backgroundColor: '#92A3FD',
        padding: 10,
        borderRadius: 20,
        borderColor:'#92A3FD',
        borderWidth:1,
        width: '30%',
        paddingHorizontal: 20,
      },
      button1: {
        backgroundColor: 'white',
        padding: 10,
        borderColor:'#92A3FD',
        borderRadius: 20,
        borderWidth:1,
        alignItems: 'center',
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
      },
      buttonText: {
        fontSize: 18,
        fontWeight: 'normal',
        textAlign: 'center',
        flexDirection: 'row',
      },
      box1: {
        flex:5,
        borderColor: 'black',
        borderRadius: 20,
        borderWidth:1,
        color: 'blue',
        padding:16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        
      },
      doc: {
        marginBottom: 10,
        padding: 20,
        height: 30,
        width: 30,
        left: '10%',
        position: "absolute",
    },
    boxText: {
      fontSize: 18,
      fontWeight: 'normal',
      textAlign: 'right',
      flexDirection: 'column',
    },
    buttonText1: {
      fontSize: 18,
      fontWeight: 'normal',
      textAlign: 'center',
      flexDirection: 'row',
      color:'gray',
    },
    
})

export default Doctors;