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
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    infodetail : {
        padding: 15,
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        // padding: 20,
        width: '100%',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
        flex: 1,
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
        fontSize: sd.fontSizes.large,
        fontFamily: 'Poppins-Medium',
        marginRight: 10,
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
        fontSize: sd.fontSizes.large,
    fontFamily: 'Poppins-Light',
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
});

export default styles;