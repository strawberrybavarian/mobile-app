
import { StyleSheet } from 'react-native';



export const DoctorSpecialtyStyle = StyleSheet.create({
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