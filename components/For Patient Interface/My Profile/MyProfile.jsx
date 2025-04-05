import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { deleteData, getData, removeData } from '../../storageUtility';
import sd from '../../../utils/styleDictionary';
import ViewProfile from './ProfileModals/ViewProfile';
import { Card } from 'react-native-paper';
import { useUser } from '../../../UserContext'; // Add this import

 
const MyProfile = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAccountModalVisible, setAccountModalVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useUser(); // Use the logout function from UserContext

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        id ? setUserId(id) : console.log('User not found');
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = () => {
        if (userId) {
          axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`)
            .then(res => {
              const { patient_firstName, patient_lastName } = res.data.thePatient;
              setFirstName(patient_firstName);
              setLastName(patient_lastName);
            })
            .catch(err => console.log(err));
        }
      };
      fetchData();
    }, [userId])
  );


  // In your component:
const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to log out?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        onPress: async () => {
          try {
            deleteData('userId');
            deleteData('userRole');
            const success = await logout();
            
            if (success) {
              // Reset navigation stack to prevent going back
              navigation.reset({
                index: 0,
                routes: [{ name: 'landingpage' }],
              });
            } else {
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
          }
        }
      }
    ],
    { cancelable: true }
  );
};

  const renderSettingOption = (icon, label, onPress = () => {}) => (

      <Card
        mode='elevated'
        onPressIn={onPress}
        style={{ 
          width: '100%', 
          padding: 5,
          paddingBottom : 10, 
          marginVertical: 10,
          backgroundColor: 'white',
        }}
      >
        <Card.Content>
          <View style={styles.settingOptionContainer}>
            <FontAwesome name={icon} size={18} style={styles.iconStyle} />
            <Text style={styles.textProfile}>{label}</Text>
            <Entypo name='chevron-right' size={20} color={sd.colors.blue} />
          </View>
        </Card.Content>
      </Card>

  );

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}> Settings </Text>
          {renderSettingOption("user", "Account", () => {navigation.navigate("viewprofile")})}
          {renderSettingOption("book", "Medical Records", ()=> {navigation.navigate('medicalrecords')})}
          {renderSettingOption("history", "Activity Logs", () => {navigation.navigate("auditpatient")})} 
          {renderSettingOption("sign-out", "Logout", handleLogout)}
        </View>
      </ScrollView>

      {/* <ViewProfile 
        isVisible={isAccountModalVisible} 
        closeModal={() => setAccountModalVisible(false)} 
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 50,
  },
  title: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.xl,
  },
  profileInfo: {
    marginTop: 10,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  profileDetails: {
    flexDirection: "column",
    marginLeft: 5,
  },
  nameText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  textJoin: {
    fontSize: 10,
    fontFamily: sd.fonts.semiBold,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButtonGradient: {
    width: 60,
    height: 25,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 12,
    fontFamily: sd.fonts.semiBold,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  background: {
    paddingHorizontal: 10,
    height: "28%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    backgroundColor: 'white',
  },
  settingsContainer: {
    marginTop: 30,
    flexDirection: "column",
    paddingLeft: 20,
    paddingRight: 20,
  },
  settingsTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.xl,
    color: sd.colors.blue,
    marginBottom: 20,
  },
  othersContainer: {
    marginTop: 10,
    padding: 20,
  },
  othersTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.large,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    //borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  settingOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: {
    //marginRight: 10,
    color: sd.colors.blue,
    flex: 1,
  },
  textProfile: {
    flex: 4,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textPrimary,
    fontSize: sd.fontSizes.medium,
  },
});

export default MyProfile;
