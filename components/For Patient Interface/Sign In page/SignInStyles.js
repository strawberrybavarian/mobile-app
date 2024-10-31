import { StyleSheet } from "react-native";
import sd from "../../../utils/styleDictionary";

export const SignInStyles = (theme) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginTop: 55,
  },
  backButton: {
    padding: 10,
  },
  headerTitleContainer: {},
  headerTitle: {
    fontSize: 15,
    color: theme.colors.primary,
    fontFamily: sd.fonts.light,
  },
  titleContainer: {
    paddingLeft: 30,
    marginTop: 50,
  },
  title: {
    fontSize: 45,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 55,
    color: theme.colors.primary,
  },
  formContainer: {
    flexDirection: "column",
    marginVertical: 25,
    paddingLeft: 30,
    paddingRight: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceVariant,
    marginVertical: 10,
    ...sd.shadows.level1,
  },
  inputField: {
    flex: 1,
    height: 50,
    fontSize: sd.fontSizes.medium,
    fontFamily: sd.fonts.light,
    paddingLeft: 10,
    top: 2,
    color: theme.colors.onSurface,
  },
  iconContainer: {
    padding: 10,
  },
  dropdownContainer: {
    height: 50,
    width: "100%",
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    marginVertical: 10,
    fontSize: 13,
    fontFamily: sd.fonts.light,
    color: theme.colors.onSurfaceVariant,
    ...sd.shadows.level1,
  },
  dropdown: {
    fontFamily: sd.fonts.light,
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    
  },
  signInButtonContainer: {
    height: 45,
    borderRadius: 40,
    marginTop: 10,
    marginHorizontal: 30,
    backgroundColor: theme.colors.primary,
  },
  signInButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  forgotPasswordText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    fontFamily: "Poppins",
    color: theme.colors.onSurface,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Poppins",
  },
});
