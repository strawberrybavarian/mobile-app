import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const styles = StyleSheet.create({
    //container
    mainContainer: {
        height: '100%',
        backgroundColor: '#f8f8f8',
        flex: 1,
    },
    
    scrollContainer: {
        flex: 1,
        marginTop: 10,
    },
    infocont: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    infodetail : {
        padding: 15,
        width: '100%',
    },
    modalContainer: {
        height: '80%',
        backgroundColor: sd.colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },

    //header
    header: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: sd.fonts.bold,
        color: '#fff',
        marginBottom: 10,
    },
    headerBadge: {
        backgroundColor: '#0056b3',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    headerBadgeText: {
        fontSize: 14,
        fontFamily: sd.fonts.medium,
        color: '#fff',
    },

    //info
    infotitle: {
        fontSize: sd.fontSizes.medium,
        fontFamily: 'Poppins-Medium',
        marginRight: 10,
        flex: 1,
    },

    infobanner: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        padding: 10,
        paddingLeft: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    infotext: {
        fontSize: sd.fontSizes.medium,
        fontFamily: 'Poppins-Light',
        marginHorizontal: 5,
        flex: 2,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EAF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontFamily: sd.fonts.medium,
        color: '#555',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontFamily: sd.fonts.bold,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoText: {
        fontSize: sd.fontSizes.medium,
        fontFamily: sd.fonts.regular,
        color: sd.colors.textSecondary,
    },

    //body
    title:{
        fontFamily:'Poppins-SemiBold',
        fontSize: 24,
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: sd.colors.red,
        flex: 1,
        marginRight: 10,
        borderRadius: 8,
    },
    modalButton: {
        padding: 10,
        borderRadius: 50,
    },
    rescheduleButton: {
        backgroundColor: sd.colors.blue,
        flex: 1,
        borderRadius: 8,
    },

    //navbar
    navcontainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
      },

    //header
    headercont:{
        top:0,
        width:'100%',
    },
});

export default styles;