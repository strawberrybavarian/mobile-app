import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const styles = StyleSheet.create({
  //container
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  // New style for the ScrollView content
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 8,
    paddingBottom: 60
  },

  // Replace scrollContainer with appointmentsContainer
  appointmentsContainer: {
    marginTop: 5,
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
    marginTop: 10,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    minWidth: 60,
  },
  monthText: {
    fontSize: 14,
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
    height: '80%',
    backgroundColor: '#eee',
    marginHorizontal: 12,
  },
  infoContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 6,
  },
  dateTime: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
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

  // toggle styles
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
    ...sd.shadows.level1,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
  },
  toggleTextActive: {
    color: sd.colors.blue,
    fontFamily: sd.fonts.medium,
  },
});

export default styles;
