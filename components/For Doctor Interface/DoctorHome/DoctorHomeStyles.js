import { Dimensions, StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

export const DoctorHomeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80, // Increased from 50 to 80 for more bottom space
    backgroundColor: theme.colors.background,
  },
  addPostButton: {
    alignSelf: 'center',
    backgroundColor: '#2F88D4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  postContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginVertical: 6, // Slightly increased from 4
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  postContent: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    fontFamily: sd.fonts.regular, // Updated to use style dictionary
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  postTimestamp: {
    fontSize: 12,
    color: '#888888',
    marginTop: 8,
    fontFamily: sd.fonts.light, // Updated to use style dictionary
  },
  noPostsText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: sd.fonts.italic, // Updated to use style dictionary
  },
  input: {
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    color: '#333333',
    marginVertical: 10,
    fontFamily: sd.fonts.regular, // Updated to use style dictionary
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pickImageButton: {
    backgroundColor: '#2EBB6D',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  pickImageButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: sd.fonts.semiBold, // Updated to use style dictionary
  },
  title: {
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 16, // Added more margin below title
    marginTop: 6, // Added more margin above title
    color: theme.colors.primary,
  },
  postButton: {
    backgroundColor: '#2F88D4',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  postAuthor: {
    flex: 3,
    fontSize: sd.fontSizes.base,
    color: theme.colors.onSurface,
    marginLeft: 10,
  },
  postImage:{
    width: 50,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  postContent: {
    fontSize: sd.fontSizes.medium,
    color: theme.colors.onSurface,
    marginTop: 10,
    marginBottom: 10,
    flex: 2,
  },
  postTimestamp: {
    fontSize: sd.fontSizes.small,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 10,
    flex: 2,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: sd.fonts.semiBold, // Updated to use style dictionary
  },
  announcementContainer: {
    backgroundColor: sd.colors.white,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
  },
  carouselContainer: {
    height: Dimensions.get('window').height / 4,
    backgroundColor: '#f8f8f8',
    margin: 30,
    borderRadius: sd.borders.radiusXL,
  },
  fab: {
    position: 'relative',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.semiBold,
    margin: 10,
    color: theme.colors.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
  },
  statusLabel: {
    fontSize: sd.fontSizes.base,
    color: theme.colors.onSurface,
    fontFamily: sd.fonts.regular, // Updated to use style dictionary
    textAlign: 'center',
    flex: 1,
  },
  statusContent: {
    fontSize: sd.fontSizes.large,
    color: theme.colors.onSurface,
    fontFamily: sd.fonts.semiBold, // Updated to use style dictionary
    flex: 1,
  },
  // New styles for selected images
  imageContainer: {
    position: 'relative',
    marginRight: 0,
    padding: 10,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right:  5,
    backgroundColor: 'red',
    zIndex: 100,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Updated status card styles for a better vertical layout
  statusCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    marginBottom: 30, // More space at bottom
  },
  statusCardWrapper: {
    width: '48%', // Slightly wider for better proportions
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 12, // Consistent padding all around
  },
  statusCardContent: {
    // Change to vertical stacking
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconContainer: {
    width: 45, // Smaller icons
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Space between icon and text
  },
  statusTextContainer: {
    width: '100%', // Take full width
    alignItems: 'center', // Center text
  },
  statusCount: {
    fontSize: 22, // Slightly smaller
    fontFamily: sd.fonts.bold,
    color: '#1976D2',
    marginBottom: 4,
    textAlign: 'center', // Center text
  },
  statusLabel: {
    fontSize: 13, // Smaller text
    fontFamily: sd.fonts.regular,
    color: '#555',
    textAlign: 'center', // Center text
  },
  loadingCard: {
    padding: 20,
    alignItems: 'center',
    marginVertical: 16, // Increased from 10
    marginBottom: 24, // Extra margin at bottom
  },
  loadingText: {
    marginTop: 12, // Increased from 10
    fontSize: 14,
    fontFamily: sd.fonts.regular, // Updated to use style dictionary
    color: '#666',
  },
});
