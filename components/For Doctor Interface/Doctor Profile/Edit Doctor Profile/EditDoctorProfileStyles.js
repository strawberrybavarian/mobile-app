import { StyleSheet } from 'react-native';
import sd from '../../../../utils/styleDictionary';

export default styles = StyleSheet.create({
  modal:{
    flex: 1,
    margin: 0
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: sd.fontSizes.medium,
    fontFamily: sd.fonts.bold,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.medium,
    marginBottom: 5,
    color: sd.colors.darkGray,

  },
  input: {
    backgroundColor: sd.colors.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: sd.colors.blue,
    fontSize: sd.fontSizes.medium,
    fontFamily: sd.fonts.semiBold,
  },
  editableInput: {
    borderWidth: 1,
    borderColor: sd.colors.blue,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 10,
    ...sd.shadows.large,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: sd.colors.blue,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 15,
  },
  badgeText: {
    color: 'white',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  cancelButton: {
    marginLeft: 10,
  },
  editButton: {
    marginLeft: 10,
  },
});
