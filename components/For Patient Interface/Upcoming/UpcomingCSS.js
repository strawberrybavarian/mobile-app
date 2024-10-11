import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

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
  tabBar : {
    backgroundColor: sd.colors.blue,
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
    marginTop: 10,
    marginBottom: 12,
    alignItems: 'center',
    // 
  },
  container1: { 
    flexDirection: 'row',
    width: '100%',
  },
  cardcont: {
    padding: 25,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    ...sd.shadows.large
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
  infoCont: {
    justifyContent: 'center',
    marginLeft: 10,
    flex: 4,
  },
  doctorName: {
    fontSize: sd.fontSizes.large,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  specialization: {
    fontSize: 14,
    fontFamily:'Poppins',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 13,
    color: '#888',
  },
  dateText: {
    fontSize: sd.fontSizes.xl,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  datecontainer: {
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: sd.colors.blue,
    flex: 1,
    padding: 10,
    borderRadius: 100,
  },
  monthText: {
    fontSize: sd.fontSizes.medium,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
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
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },

  //navbar
  navcontainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default styles;
