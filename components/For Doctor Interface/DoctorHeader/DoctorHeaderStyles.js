import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

export default DrHeaderStyles =  (theme) => StyleSheet.create({
  mainContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
    width: '100%',
    height: 'auto',
    ...sd.shadows.level1,
    shadowOffset: { width: 0, height: 5 },
    backgroundColor: theme.colors.background,
    zIndex: 100,
  },
  
  wrapper: {
    // marginTop: 0,
    flexDirection: "row",
    height: 60,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  textCont: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    marginLeft: 5,
  },
  infoCont: {
    flexDirection: "row",
    width: 200,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    marginVertical: 10,
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
  },
  bellContainer: {
    position: 'relative',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Add styles for header actions and refresh button
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});
