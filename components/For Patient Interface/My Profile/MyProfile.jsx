import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DoctorProfileStyles } from '../../For Doctor Interface/DoctorStyleSheet/DoctorCSS';
import { getData } from '../../storageUtility';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect } from '@react-navigation/native';


const MyProfile = ({ navigation }) => {

  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          console.log("userId: "+id);
          setUserId(id);
        } else {
          console.log('User not found');
        }
      } catch (err) {
        console.log(err);
      }}
    
    fetchUserId();
    }, []);

    useFocusEffect(
      useCallback(() => {
        const fetchData = () => {
          axios.get(`${ip.address}/patient/api/onepatient/${userId}`)
            .then(res => {
              console.log(res.data.thePatient);
              const patient = res.data.thePatient;
              setFirstName(patient.patient_firstName);
              setLastName(patient.patient_lastName);
            })
            .catch(err => {
              console.log(err);
            });
        };
    
        fetchData()

      }, [userId])
  )
  
  const logoutButton = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('landingpage'),
        },
      ],
      { cancelable: true }
    );
  };


  const profileFormEdit = () => {
    navigation.navigate('profileform')
  }

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.background}>

          <View style={styles.container}>
            <View style={styles.con1}>
              <Text style={styles.title}>My Profile</Text>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <FontAwesome5  name="ellipsis-h" size={15} />
            </TouchableOpacity>
          </View>

          <View style={styles.container2}>
            <Image
              source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD29ZbwcUoURx5JZQ0kEwp6y4_NmjEJhh2Z6OdKRkbUw&s" }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
              <View style={styles.container21}>
                <Text style={{fontFamily:'Poppins-SemiBold', fontSize:18}}>{firstName} {lastName}</Text>
                <View style={styles.container211}>
                  <Text style={styles.textJoin}>Joined Since </Text>
                  <Text style={styles.textJoin}>February 29, 2024 </Text>
                </View>
                <Text style={styles.textJoin}>id: P0001</Text>
              </View>

              <TouchableOpacity style={styles.editButton} onPress={profileFormEdit}>
                <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 2 }}
                  colors={["#92A3FD", "#9DCEFF"]}
                  style={{
                    width: 60,
                    height: 25,
                    borderRadius: 40,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <Text style={styles.textButton}>Edit</Text>
                </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      
        <View style={DoctorProfileStyles.container3}>
        <View style={DoctorProfileStyles.settings}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14}}> Settings </Text>
            <View style={DoctorProfileStyles.settingContainer}>
                <TouchableOpacity style={DoctorProfileStyles.settingItem}>
                    <View style={DoctorProfileStyles.container31}> 
                        <FontAwesome name="globe" size={18} style={DoctorProfileStyles.iconStyle} />
                        <Text style={DoctorProfileStyles.textProfile}>Language</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={DoctorProfileStyles.settingItem}>
                <View style={DoctorProfileStyles.container31}> 
                        <Entypo name="map" size={18} style={DoctorProfileStyles.iconStyle} />
                        <Text style={DoctorProfileStyles.textProfile}>Activity Logs</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={DoctorProfileStyles.settingItem}>
                    <View style={DoctorProfileStyles.container31}> 
                        <Entypo name="globe" size={18} style={DoctorProfileStyles.iconStyle} />
                        <Text style={DoctorProfileStyles.textProfile}>Others</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
                
            </View>
        </View>
      </View>

      <View style={DoctorProfileStyles.container4}>
        <View style={DoctorProfileStyles.settings4}>
        <Text style={{}}> Others</Text>
            <View style={DoctorProfileStyles.settingContainer4}>

                <TouchableOpacity style={DoctorProfileStyles.settingItem4}>
                    <View style={DoctorProfileStyles.container31}> 
                        <FontAwesome name="exclamation-circle" size={18} style={DoctorProfileStyles.iconStyle} />
                        <Text style={DoctorProfileStyles.textProfile}>About Us</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={DoctorProfileStyles.settingItem4}>
                    <View style={DoctorProfileStyles.container31}> 
                            <FontAwesome5 name="headphones" size={18} style={DoctorProfileStyles.iconStyle} />
                            <Text style={DoctorProfileStyles.textProfile}>Customer Service</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={DoctorProfileStyles.settingItem}>
                    <View style={DoctorProfileStyles.container31}> 
                            <FontAwesome5 name="envelope-open-text" size={18} style={DoctorProfileStyles.iconStyle} />
                            <Text style={DoctorProfileStyles.textProfile}>Invite Other</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
                
                <TouchableOpacity style={DoctorProfileStyles.settingItem} onPress={logoutButton}>
                    <View style={DoctorProfileStyles.container31}> 
                            <FontAwesome name="sign-out" size={18} style={{textAlign:'center', alignItems:'center',  marginRight: 10, color: '#EB3800'}} />
                            <Text style={DoctorProfileStyles.textProfile} >Logout</Text>
                    </View>
                </TouchableOpacity>
            </View> 
         </View> 
      </View>        
  
  
 
      </ScrollView>
      <NavigationBar></NavigationBar>
    </>
  )
}

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  
    marginTop: 30,

  },
  title:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
  },
  con1: {
  
  },
  container2: {
    marginTop: 10,
    flexDirection: "row",
    height: 50,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
   
 
  },
  container21: {

    flexDirection: "column",
    marginLeft: 5,
  },
  container211: {
    flexDirection: "row",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "",

  },
  textButton: {
    color: "white",
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  textJoin:{
    fontSize: 10,
    fontFamily: 'Poppins',
  },


  // Settings Container
  container3: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
    flex: 1,
    
    
  },
  settings: {
    width: "98%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#1D242A12",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 40,
    elevation: 40,
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  settingContainer: {
    padding: 2,
    flex: 1, 
    
  },
  container31: {
    flex: 1,
    paddingTop: 10,
    
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

//   Container 4
  container4: {
    padding: 10,
    alignItems: "center",
    flex: 1,
  },
  settings4: {
    width: "98%",

    borderRadius: 16,
    shadowColor: "#1D242A12",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 40,
    elevation: 5,
    padding: 20,

  },
  settingItem4: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  
  },
  settingContainer4: {
    padding: 2,
    flex: 1, 
    backgroundColor: 'white',
  },
  container314: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  //Text
  textProfile:{
    fontFamily: 'Poppins', 
    fontSize: 14,
    color: '#888888' 
  },
  iconStyle:{
    textAlign:'center', alignItems:'center',  marginRight: 10, color: '#92A3FD'
  },
  background:{
    paddingHorizontal: 10,
    height: "28%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.20, 
    shadowRadius: 20, 
    backgroundColor: 'white'
  }
});
