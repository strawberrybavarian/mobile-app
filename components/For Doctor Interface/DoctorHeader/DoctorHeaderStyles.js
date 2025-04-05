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
});
