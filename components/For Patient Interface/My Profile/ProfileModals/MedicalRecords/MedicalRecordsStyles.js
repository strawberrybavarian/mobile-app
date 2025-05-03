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
        marginBottom: 16,
    },
    headerText: {
        fontSize: sd.fontSizes.large,
        fontFamily: sd.fonts.bold,
        textAlign: 'center',
        flex: 2,
    },
    segmentedButtons: {
        marginVertical: 16,
    },
    recordCountContainer: {
        alignSelf: 'flex-end',
        backgroundColor: sd.colors.blue,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        marginBottom: 12,
    },
    recordCountText: {
        color: 'white',
        fontFamily: sd.fonts.medium,
        fontSize: 12,
    },
    dropdownContainer: {
        marginVertical: 16,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F9FF',
        borderWidth: 1,
        borderColor: '#E0E9FF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownIcon: {
        marginRight: 8,
    },
    dropdownText: {
        flex: 1,
        fontSize: 16,
        fontFamily: sd.fonts.medium,
        color: sd.colors.blue,
    },
    dropdownArrow: {
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    dropdownMenu: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownItemActive: {
        backgroundColor: '#F6F9FF',
    },
    dropdownItemIcon: {
        marginRight: 16,
        width: 20,
        textAlign: 'center',
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 16,
        fontFamily: sd.fonts.regular,
        color: sd.colors.darkGray,
    },
    dropdownItemTextActive: {
        fontFamily: sd.fonts.medium,
        color: sd.colors.blue,
    },
})