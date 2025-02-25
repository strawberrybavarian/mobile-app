import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

export const styles = StyleSheet.create({
  modal : {
    margin: 0,  // Ensures the modal takes up the entire screen
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    height: '60%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  dropdownBody : {
    width: '100%',
  },
  title: {
    fontSize: sd.fontSizes.large,
    marginBottom: 10,
    fontFamily: sd.fonts.semiBold,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  dropdownParent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dropdownContainer: {
    flex : 1,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  dropdown: {
    flex : 1,
    height: 100,
    //width: '100%',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
  },
  dropdownStyle: {
    backgroundColor: 'white',
  },
  selectedTextStyle: {
    color: '#000',
  },
  placeholderStyle: {
    color: '#999',
  },
  buttonContainer: {
    bottom: 0,
    width: '100%',
    position: 'absolute',
    padding: 10,
  },
  button: {
    backgroundColor: '#5c85ff',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
