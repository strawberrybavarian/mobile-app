import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 55,
  },
  con1: {},
  textcon: {
    paddingLeft: 30,
    marginTop: 50,
  },
  con2: {
    flexDirection: "column",
    marginTop: 25,
    paddingLeft: 30,
    paddingRight: 30,
  },
  text1: {
    fontSize: 45,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 55,
  },
  title: {
    fontSize: 15,
    color: "#92A3FD",
    fontFamily: "Poppins-SemiBold",
  },
  pickerContainer: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
    fontSize: 13,
    fontFamily: "Poppins",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerItem: {
    fontFamily: "Poppins",
    fontSize: 15,
    paddingLeft: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    fontFamily: "Poppins",
    paddingLeft: 10,
    top: 2,
  },
  eyeIconContainer: {
    padding: 10,
  },
  textButton: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    marginTop: 1,
    fontFamily: "Poppins",
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    fontFamily: "Poppins",
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Poppins",
  },
});
