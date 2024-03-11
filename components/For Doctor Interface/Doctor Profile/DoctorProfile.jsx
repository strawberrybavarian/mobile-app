// DoctorMain.jsx
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert} from 'react-native';
import DoctorNavigation from '../DoctorNavigation/DoctorNavigation';
import DoctorAppointment from '../DoctorAppointment/DoctorAppointment';
import DoctorHome from '../DoctorHome/DoctorHome';
import DoctorHeader from '../DoctorHeader/DoctorHeader';
import { DoctorProfileStyles } from '../DoctorStyleSheet/DoctorCSS';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';
const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const navigation = useNavigation();

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

  

  return (
  <>
    
    <View style={DoctorProfileStyles.container3}>
        <View style={DoctorProfileStyles.settings}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14}}> Doctor Administration</Text>
            <View style={DoctorProfileStyles.settingContainer}>
                <TouchableOpacity style={DoctorProfileStyles.settingItem}>
                    <View style={DoctorProfileStyles.container31}> 
                        <FontAwesome name="globe" size={18} style={DoctorProfileStyles.iconStyle} />
                        <Text style={DoctorProfileStyles.textProfile}>Manage Your Schedule</Text>
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
                        <Text style={DoctorProfileStyles.textProfile}>Customize My Profile</Text>
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
 
  </>
  
   


         
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navigationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DoctorProfile;
