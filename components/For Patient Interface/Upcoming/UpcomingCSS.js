import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  //container
  mainContainer: {
    height: '100%',
    backgroundColor: '#f8f8f8',
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },


  //header
  header: {
    top:0,
    width:'100%',
  },
  arrowButton: {
    marginRight: 20,
    verticalAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontFamily:'Poppins-SemiBold',
    padding: 10,
  },

  // tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tab: {
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 10,

  },
  tabtext:{
    fontSize: 14,
    fontFamily:'Poppins',
  },

  // appointments
  cont: {
    flexDirection:'column',
    // backgroundColor: '#ffffff',
    width: '100%',
    // padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    // 
  },
  container1: { 
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardcont: {
    margin: 6,
    width: '90%',
    marginHorizontal: 100,
    padding: 25,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderRadius: 20,
  },
  status: {
    backgroundColor: 'rgba(240, 182, 75, 0.30)',
    width: 90,
    height: 25,
    borderRadius: 4,
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 5,
  },
  statusContainer: {
    flexDirection:'row'
  },
  text1: {
    color: 'red',
    fontFamily: 'Poppins-SemiBold'
  },
  cancelButton: {
    padding: 10,
    height: 45,
    borderColor: "red",
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderColor: 'rgba(158, 150, 150, .3)'
  },
  
  doctorName: {
    fontSize: 20,
    fontFamily:'Poppins-SemiBold',
  },
  specialization: {
    fontSize: 14,
    fontFamily:'Poppins',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 12,
    marginBottom: 20,
  },
  filter1: {
    height: 100,
    width: 100,
    borderRadius: 40,
  },
  gradientButton: {
    width: 150,
    padding: 10,
    height: 45,
    borderRadius: 40,
    marginTop: 12,  
  },
  gradientButtonContent: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center"
  },
  gradientButtonText: {
    color: 'white', 
    fontFamily: 'Poppins-SemiBold'
  },
  noAppointments: {
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginVertical: 20,
  },

  //navbar
  navcontainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default styles;
