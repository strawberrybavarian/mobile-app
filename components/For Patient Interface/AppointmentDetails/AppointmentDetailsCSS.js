import { StyleSheet } from 'react-native';

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
    },
    infocont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: 'rgba(158, 150, 150, .3)',
    },

    
    //header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        width: '100%',
    },

    //body
    title:{
        fontFamily:'Poppins-SemiBold',
        fontSize: 24,
        textAlign: 'center',
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
    }
});

export default styles;