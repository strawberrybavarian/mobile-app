import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from './HeaderStyle';

import { ip } from '../../ContentExport';
import { getData } from '../storageUtility';

const Header3 = ({name, imageUri}) => {
    const [search, setSearch] = useState('');
    const [userId, setUserId] = useState('');
    const [patient, setPatient] = useState(null); // Initialized to null
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [image, setImage] = useState("images/014ef2f860e8e56b27d4a3267e0a193a.jpg")
    const navigation = useNavigation();

    const handleNotification = () => {
      navigation.navigate('doctornotification')
    };

    // useEffect(() => {
    //   getData('userId').then((id) => {
    //     setUserId(id);
    //     console.log('id:',id);
    //   });
    // }, []);

  //   useFocusEffect(
  //     useCallback(() => {
  //         const fetchUserId = async () => {
  //             try {
  //                 const id = await getData('userId');
  //                 if (id) {
  //                     setUserId(id);
  //                 } else {
  //                     console.log('User not found');
  //                 }
  //             } catch (err) {
  //                 console.log(err);
  //             }
  //         };
  //         fetchUserId();
  //     }, [])
  // );    

    return (
      <>
        <View style={styles.mainContainer}> 
          <View style={styles.wrapper}>
            <Pressable onPress={() => navigation.navigate('My Profile')}>
            <Image
              source={imageUri ? { uri: `${ip.address}/${imageUri}` } : { uri: "images/014ef2f860e8e56b27d4a3267e0a193a.jpg" }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />

            </Pressable>

            <View style={styles.textCont}>
              <View style={styles.infoCont}>
                {/* Optional chaining to prevent undefined errors */}
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>
                  {name ? name : 'John Doe'}
                </Text>
              </View>

              <View style={styles.infoCont}>
                <Text style={{ fontFamily: 'Poppins', fontSize: 12 }}> 
                  <FontAwesome5 name="circle" size={12} style={{color:'green'}} />  Active Now
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleNotification}>
              <FontAwesome5 name="bell" size={25} style={{}} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
};

export default Header3;
