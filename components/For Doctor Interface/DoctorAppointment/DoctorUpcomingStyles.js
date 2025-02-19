import { StyleSheet, Dimensions } from 'react-native';
import sd from '../../../utils/styleDictionary';
const { height } = Dimensions.get('window');

export default DoctorUpcomingStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  cont: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '100%',   
    height: '100%',
    marginTop: 10,
  },
  cardcont: {
    padding: 25,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    ...sd.shadows.level2,
  },
  container1: {
    flexDirection: 'row',
  },
  doctorName: {
    fontSize: sd.fontSizes.large,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 13,
    color: '#888',
  },
  noAppointments: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
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
  dateText: {
    fontSize: sd.fontSizes.xl,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  infoCont: {
    justifyContent: 'center',
    marginLeft: 10,
    flex: 4,
  },
  // Modal

  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    height: height,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: sd.fontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: sd.fontSizes.medium,
    fontFamily: 'Poppins-SemiBold',
    color: sd.colors.blue,
    textAlign: 'left',
  },
  label: {
    fontSize: sd.fontSizes.large,
    fontFamily: 'Poppins-Medium',
    marginRight: 10,
    },
  modalTextCont: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    },
  modalText:{
    fontSize: sd.fontSizes.large,
    fontFamily: 'Poppins-Light',
    },
  button: {
    backgroundColor: sd.colors.red,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    flex: 1,
    marginHorizontal: 0,
    textAlign: 'center',
    marginHorizontal: 5,
    },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    bottom: 0,
    padding: 20,
    position: 'absolute',
    width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: sd.fontSizes.medium,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
    centeredModal: {
        justifyContent: 'center',  // Center the modal on the screen
        alignItems: 'center',
        margin: 0,  // No margin for the modal
      },
      floatingModalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',  // Adjust width as needed
      },
      floatingButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
      },

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

});


