// DoctorNavigationStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  NavContainer: {
    position: 'relative',
    width: '100%',
    bottom: 0,
  },
  NavBar: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 5,
    shadowOffset: { width: 0, height: 50 },
    shadowColor: 'black',
    shadowOpacity: 0.20, 
    shadowRadius: 20, 
    borderWidth: 2,
    borderColor: '#f0eeeea2',
  },
  IconBehavior: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 7,
  },
  texts: {
    fontSize: 9,
    marginTop: 2,
  },
});

export default styles;
