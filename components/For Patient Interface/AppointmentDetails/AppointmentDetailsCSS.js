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
        backgroundColor: '#f8f8f8',
        padding: 10,
        paddingBottom: 120,
        marginVertical: 10,
    },
    infocont: {

        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
        borderColor: 'rgba(158, 150, 150, .3)',
        borderRadius: 20,
    },
    infodetail : {
        padding: 15,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },

    
    //header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: '100%',
    },

    //info
    infotitle: {
        fontFamily: sd.fonts.semiBold,
        fontSize: sd.fontSizes.medium,
        color: '#197195',
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
        fontFamily: 'Poppins',
        fontSize: sd.fontSizes.medium,
    },

    //body
    title:{
        fontFamily:'Poppins-SemiBold',
        fontSize: 24,
        textAlign: 'center',
    },
    modalButton: {
        padding: 10,
        borderRadius: 20,
    },

    //navbar
    navcontainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
      },

    //header
    headercont:{
        // position:'absolute',
        top:0,
        width:'100%',
    },

    

    infotitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    infocont: {
        marginBottom: 10,
    },
    infodetail: {
        marginTop: 5,
    }
});

export default styles;