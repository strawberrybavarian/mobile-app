import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import DrHeaderStyles from './DoctorHeaderStyles';
import { ip } from '../../../ContentExport';
import { useTheme } from 'react-native-paper';
import { useUser } from '../../../UserContext';

// Fix: Changed from (imageUri) to ({name, imageUri}) to properly accept props
const DoctorHeader = ({ name, imageUri }) => {
    const navigation = useNavigation();
    const theme = useTheme();
    const styles = DrHeaderStyles(theme);
    
    // Use the UserContext hook instead of manual fetching
    const { user } = useUser();
    
    const handleNotification = () => {
      navigation.navigate('doctornotification');
    };
    
    // Create a proper image URL with fallback for missing images
    const defaultImage = 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';
    
    // Fix: Proper image URL construction with fallback
    const imageSource = imageUri 
      ? { uri: `${ip.address}/${imageUri}` } 
      : { uri: defaultImage };
 
    return (
      <>
        <View style={styles.mainContainer}> 
          <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => navigation.navigate('doctorprofile')}>
              <Image
                source={imageSource}
                style={{ width: 50, height: 50, borderRadius: 50 }}
                // Add error handling for image loading failures
                onError={() => console.log('Image failed to load')}
              />
            </TouchableOpacity>
            <View style={styles.textCont}>
                <View style={styles.infoCont}>
                  <Text style={{fontFamily: 'Poppins-Medium', fontSize: 18}}>
                    {/* Use name prop if available, otherwise fall back to user context */}
                    {name || (user ? `Dr. ${user.dr_firstName} ${user.dr_lastName}` : 'Loading...')}
                  </Text>
                </View>
                <View style={styles.infoCont}>
                  <Text style={{fontFamily: 'Poppins', fontSize: 12 }}> 
                    <FontAwesome name="circle" size={12} style={{color:'green'}} />  Active Now
                  </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={handleNotification}>
                <FontAwesome5 name="bell" size={25} style={{color: theme.colors.primary}} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
};

export default DoctorHeader;