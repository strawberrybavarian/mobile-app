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
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  monthText: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#555',
  },
  dateText: {
    fontSize: 24,
    fontFamily: sd.fonts.bold,
    color: '#333',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#007BFF',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#007BFF',
  },
  noAppointments: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#666',
    textAlign: 'center',
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
