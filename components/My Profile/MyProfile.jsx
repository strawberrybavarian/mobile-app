import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../Navigation/NavigationBar';

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";


const MyProfile = ({ navigation }) => {

  const signinPageButton = () => {
    navigation.navigate('')
  }

  return (
    <>
      <ScrollView style={styles.scrollContainer}>
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
          <Text>Analyn Santos</Text>
          <View style={styles.container211}>
            <Text style={styles.textJoin}>Joined Since </Text>
            <Text style={styles.textJoin}>February 29, 2024 </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
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
            
    
  
    {/* Settings Container */}
      <View style={styles.container3}>
        <View style={styles.settings}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 14}}> Settings</Text>
            <View style={styles.settingContainer}>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.container31}> 
                        <FontAwesome name="globe" size={14} style={{textAlign:'center', alignItems:'center', justifyContent: 'center',  marginRight: 5, color: '#92A3FD'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: '#888888'}}>Language</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                <View style={styles.container31}> 
                        <Entypo name="map" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5, color: '#92A3FD'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: '#888888' }}>Location</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.container31}> 
                        <Entypo name="globe" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5, color: '#92A3FD'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12, color: '#888888'}}>Other</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
                
            </View>
        </View>
      </View>
    
    {/* Others Container  */}
       <View style={styles.container4}>
        <View style={styles.settings4}>
        <Text style={{}}> Others</Text>
            <View style={styles.settingContainer4}>

                <TouchableOpacity style={styles.settingItem4}>
                    <View style={styles.container314}> 
                        <FontAwesome name="exclamation-circle" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5, color: '#92A3FD'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12,color: '#888888' }}>About Us</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem4}>
                <View style={styles.container314}> 
                        <FontAwesome5 name="headphones" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5, color: '#92A3FD'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12,color: '#888888'}}>Customer Service</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                <View style={styles.container31}> 
                        <FontAwesome5 name="envelope-open-text" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5, color: '#92A3FD'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12,color: '#888888'}}>Invite Other</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                <View style={styles.container31}> 
                        <FontAwesome name="sign-out" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5, color: '#EB3800'}} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 12,color: '#888888'}} >Logout</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
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
    padding: 15,
    marginTop: 30,
  },
  title:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  con1: {
  },
  container2: {
    marginTop: -10,
    flexDirection: "row",
    height: 50,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    marginBottom: 10, 
  },
  container21: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    marginLeft: 5,
  },
  container211: {
    flexDirection: "row",
    width: 200,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "",

  },
  textButton: {
    color: "white",
    fontSize: 9,
    fontFamily: 'Poppins',
  },
  textJoin:{
    fontSize: 9,
    fontFamily: 'Poppins',
  },
  container3: {
  
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#1D242A12",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 40,
    elevation: 40,
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
  },
  container314: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  scrollContainer: {
    flexGrow: 1,
  },

});
