import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const styles = StyleSheet.create({
    mainContaineer: {
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
    headercont: {
        marginTop: 0,
        flexDirection: "row",
        height: 'auto',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderBottomLeftRadius: sd.borders.radiusXL,
        borderBottomRightRadius: sd.borders.radiusXL,
        alignItems: "center",
        marginBottom: 10, 
        ... sd.shadows.large,
      },
    headerTextCont: {
        flex: 1,
        flexDirection: "column",
        padding: 5,
        marginLeft: 5,
    },
    textCont: {
        flexDirection: "row",
        width: 200,
    },
    editButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "",
    },

});

export default styles;