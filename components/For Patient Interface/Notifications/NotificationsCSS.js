import { StyleSheet, Dimensions } from "react-native";
import sd from "../../../utils/styleDictionary";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...sd.shadows.small,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.blue,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 80,
    backgroundColor: '#f8f8f8',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  dateHeader: {
    fontSize: 14,
    fontFamily: sd.fonts.semiBold,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  unreadNotification: {
    backgroundColor: '#f0f7ff',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 16,
    marginTop: 4,
  },
  notificationIcon: {
    padding: 10,
    borderRadius: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: sd.colors.red,
    borderRadius: 5,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeadline: {
    fontSize: 15,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333',
    marginBottom: 8,
  },
  unreadText: {
    fontFamily: sd.fonts.semiBold,
    color: '#000',
  },
  thumbnailContainer: {
    position: 'relative',
    marginBottom: 8,
    width: 120,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  notificationThumbnail: {
    width: '100%',
    height: '100%',
  },
  moreImagesIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
  },
  moreImagesText: {
    color: 'white',
    fontSize: 12,
    fontFamily: sd.fonts.medium,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#888',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    ...sd.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalIcon: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 24,
    marginRight: 16,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.blue,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalScrollContent: {
    padding: 20,
    maxHeight: 300,
  },
  imagesContainer: {
    width: '100%',
    height: width * 0.6, // Maintain aspect ratio
  },
  imageSlide: {
    width: width,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: width * 0.6,
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 3,
  },
  activePaginationDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalTime: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#888',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: sd.colors.blue,
    paddingVertical: 14,
    paddingHorizontal: 24,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
  }
});

export default styles;