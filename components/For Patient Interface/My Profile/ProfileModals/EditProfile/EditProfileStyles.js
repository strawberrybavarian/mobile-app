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
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#2196F3',
    marginBottom: 16,
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
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#F0F0F0',
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  profileImageTouchable: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarContainer: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalView: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#F2F2F2',
  },
  modalUploadButton: {
    backgroundColor: '#2196F3',
  },
  modalCancelText: {
    color: '#333',
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  modalUploadText: {
    color: 'white',
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});