import { StyleSheet } from "react-native";
import sd from "../../../../../utils/styleDictionary";

export default styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        backgroundColor: sd.colors.white,
    },
    scrollContainer:{
        backgroundColor: sd.colors.white,
        flex: 1,
        padding: 20,
        paddingBottom: 200,
    },
    //header
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.bold,
        textAlign: 'center',
        flex: 2,
    },
})