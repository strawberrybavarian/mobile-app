import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";

const MyProfile = ({ navigation }) => {

  const signinPageButton = () => {
    navigation.navigate('')
  }

  return (
    <>
    
      <View style={styles.container}>
        <View style={styles.con1}>
          <Text style={styles.title}>My Profile</Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="ellipsis-h" size={15} />
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
        <Text style={{}}> Settings</Text>
            <View style={styles.settingContainer}>
                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.container31}> 
                        <Entypo name="globe" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5,}} />
                        <Text>Language</Text>
                    </View>
                    
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                <View style={styles.container31}> 
                        <Entypo name="map" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5,}} />
                        <Text>Location</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    
    {/* Others Container */}
      <View style={styles.container4}>
        <View style={styles.settings4}>
        <Text style={{}}> Others</Text>
            <View style={styles.settingContainer4}>

                <TouchableOpacity style={styles.settingItem4}>
                    <View style={styles.container314}> 
                        <Entypo name="globe" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5,}} />
                        <Text>About Us</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem4}>
                <View style={styles.container314}> 
                        <Entypo name="map" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5,}} />
                        <Text>Location</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem4}>
                <View style={styles.container314}> 
                        <Entypo name="map" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5,}} />
                        <Text>Location</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem4}>
                <View style={styles.container314}> 
                        <Entypo name="map" size={14} style={{textAlign:'center', alignItems:'center',  marginRight: 5,}} />
                        <Text>Location</Text>
                    </View>
                    <Entypo name="chevron-thin-right" size={11} />
                </TouchableOpacity>

            </View>
        </View>
      </View>
    </>
  )
}

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 35,
  },
  con1: {
    marginBottom: 1,
  },
  container2: {
    marginTop: 10,
    flexDirection: "row",
    height: 50,
    padding: 10,
    alignItems: "center",
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
    fontSize: 12,
  },
  textJoin:{
    fontSize: 9,
  },
  container3: {
    marginTop: 15,
    padding: 10,
    alignItems: "center",
  },
  settings: {
    width: "98%",
    height: 125,
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
    marginBottom: 15,
  },
  settingContainer:{
    padding: 10,
  },
  container31:{
    flexDirection: "row",
    alignItems: 'center',
   
  },
//   container 4
  container4: {
    padding: 10,
    alignItems: "center",
  },
  settings4: {
    width: "98%",
    height: 190,
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
    marginBottom: 15,
  },
  settingContainer4:{
    padding: 10,
  },
  container314:{
    flexDirection: "row",
    alignItems: 'center',
   
  }




});
