import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: -20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    marginVertical: 10,
    paddingLeft: 10,
  },
  postInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
  },
  buttonPostContainer: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 10,
    backgroundColor: '#92A3FD',
    overflow: 'hidden',
    height: 60,
    justifyContent: 'center',
  },
  postButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  postButton: {
    fontFamily: 'Poppins',
  },
  announcementContainer: {
    backgroundColor: '#F9F5FF',
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
});
