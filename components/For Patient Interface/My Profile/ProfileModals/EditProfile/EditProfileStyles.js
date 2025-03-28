import { StyleSheet, Platform } from 'react-native';
import sd from '../../../../../utils/styleDictionary';

export default EditProfileStyles = (theme) => StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // Add padding for iOS to handle the notch
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingBottom: 20, // Add padding at the bottom for better spacing
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: sd.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center', // Center the title for consistency
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontFamily: sd.fonts.regular,
    color: theme.colors.onSurface,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  imageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: theme.colors.onPrimary,
    fontSize: 18,
    fontFamily: sd.fonts.bold,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});