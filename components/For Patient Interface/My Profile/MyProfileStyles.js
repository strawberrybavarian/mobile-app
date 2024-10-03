// MyProfileStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 30,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 30,
  },
  profileInfo: {
    marginTop: 10,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  profileDetails: {
    flexDirection: "column",
    marginLeft: 5,
  },
  nameText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  textJoin: {
    fontSize: 10,
    fontFamily: 'Poppins',
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButtonGradient: {
    width: 60,
    height: 25,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 12,
    fontFamily: 'Poppins',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  background: {
    paddingHorizontal: 10,
    height: "28%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
    backgroundColor: 'white',
  }
});
