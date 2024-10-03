
import { StyleSheet } from 'react-native';

export const DoctorSpecialtyStyles = StyleSheet.create({
  
    bluecont: {
        paddingTop: 10,
        width: '100%',
        height: 193,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden', // Clip child elements to prevent shadow from being visible on the sides
        elevation: 2, // Adjust the elevation value based on your preference
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 }, // Shadow offset, adjust the height value for the desired distance
        shadowOpacity: 0.20, 
        shadowRadius: 20, 
      },
      container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        marginTop: 30,
      },
    
      container2: {
        marginTop: 40,
        flexDirection: "row",
        height: 60,
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        alignItems: "center",
        marginBottom: 10, 
      },
      container21: {
        flex: 1,
        flexDirection: "column",
        padding: 5,
        marginLeft: 5,
      },
      container211: {
        flexDirection: "row",
        width: 200,
      },
      editButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "",
    
      },
      textButton: {
        color: "white",
        fontSize: 12,
        fontFamily: 'Poppins',
      },
      textJoin:{
        fontSize: 12,
        fontFamily: 'Poppins',
      },
    
      con3: {
        flexDirection: "column",
        marginTop: -5,
        paddingLeft: 20,
        paddingRight: 20,
      },
      searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#F2F4F7",
        marginVertical: 10,
        paddingLeft: 10,
      },
      searchInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
      },
      filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        padding: 10,
      },
      container4:{
        marginTop: 10,
        flexDirection: 'column',
        padding: 10.
      },
    
      container41:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
      },
    
      specialtyButton:{
        backgroundColor: '#F9F5FF',
        width: '48%',
        height: 120,
        aspectRatio: 1,
        marginBottom: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: '#FFFFFF',
      },
      container42:{
    
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
       
      },
      images:{
        width: 90,
        height: 90, 
      
      },
    
      buttonText:{
        fontFamily:"Poppins",
        fontSize: 15,
        bottom: 0,
        textAlign: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
      },
      scrollContainer: {
        backgroundColor: '#FFFFFF',
        flexGrow: 1,
    
      },
});

export const UpcomingStyles = StyleSheet.create({
    status:{
        backgroundColor: 'rgba(240, 182, 75, 0.30)',
        width: 85,
        height: 22,
        color: 'rgba(65, 52, 10, 1)',
        borderRadius: 4,
        fontFamily: 'Poppins',
        justifyContent:'center',
        alignItems:'center',
        textAlign: 'center',
        marginLeft: 5,
      },

      status2:{
        backgroundColor: 'rgba(108, 240, 75, 0.3)',
        width: 85,
        height: 22,
        color: 'rgba(25, 190, 25, 1)',
        borderRadius: 4,
        fontFamily: 'Poppins',
        justifyContent:'center',
        alignItems:'center',
        textAlign: 'center',
        marginLeft: 5,
      },
      statusContainer:{
        flexDirection:'row'
      },
      text1:{
        color: 'red',
        fontFamily: 'Poppins-SemiBold'
      },
      cont:{
        flexDirection:'column',
        padding: 10,
        backgroundColor: '#ffffff',
        width: '100%',
        height: 210,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      },
      navcontainer:{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        },
      cancelButton:{
        padding: 10,
        height: 45,
        borderColor: "red",
        borderRadius: 40,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
      },
      buttonsContainer:{
        marginTop: 20,
       flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        borderTopWidth: 1,
        borderColor: 'rgba(158, 150, 150, .3)'
      },
      container: {
     
       
        alignItems: 'flex-start',
        flexDirection:'row',
        padding: 20,
      },
    
      title: {
        fontSize: 24,
        fontFamily:'Poppins-SemiBold',
        marginBottom: 10,
        padding: 10,
    
      },
      text: {
        fontSize: 16,
      },
      magni: {
        marginBottom: 10,
        padding: 25,
        height: 30,
        width: 30,
        right: '20%',
        position: "absolute",
    },
    filter: {
        marginBottom: 10,
        padding: 25,
        height: 30,
        width: 30,
        left: '80%',
        position: "absolute",
    },
    filter1: {
    
    
      height: 90,
      width: 90,
      borderRadius: 40,
    
    
    },
    doctorName: {
      fontSize: 18,
      fontFamily:'Poppins-SemiBold',
     
    },
    specialization: {
      fontSize: 14,
      fontFamily:'Poppins',
      color: '#4d4b4b',
    },
    dateTime: {
      fontSize: 12,
      marginBottom: 20,
    },
    button:{
        justifyContent: "center", 
        alignItems: "center",
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 40,
        width: 90,
        padding: 10,
        height: 45,
        marginTop: 12,
    },
    button1:{
    
        justifyContent: "center", 
        alignItems: "center",

        borderRadius: 40,
        width: 90,
        padding: 10,
        height: 45,
        marginTop: 12,
        borderColor: 'red',
        borderWidth: 2,
    },

    button2:{
        justifyContent: "center", 
        alignItems: "center",
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 40,
        width: 100,
        padding: 10,
        height: 45,
        marginTop: 12,
    },

    button3:{
    
        justifyContent: "center", 
        alignItems: "center",
        borderRadius: 40,
        width: 100,
        padding: 10,
        height: 45,
        marginTop: 12,
        borderColor: '#fd9217',
        borderWidth: 2,
    },

    button4:{
    
        justifyContent: "center", 
        alignItems: "center",
        borderRadius: 40,
        width: 100,
        padding: 10,
        height: 45,
        marginTop: 12,
        borderColor: '#1767fd',
        borderWidth: 2,
    },
    patientid:{
        lineHeight: 15,
        fontSize: 14,
        fontFamily: 'Poppins',
        color: '#4d4b4b',
    }
});

export const upperNavigationStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    tabText: {
      fontSize: 16,
      marginBottom: 2,
      fontFamily: 'Poppins',
    },
});
  
  export const tabStyles = {
    activeTintColor: '#92A3FD',
    inactiveTintColor: '#98A3B3',
    labelStyle: upperNavigationStyles.tabText,
    indicatorStyle: {
      backgroundColor: '#92A3FD',
    },
};

  export const DoctorHomeStyles = StyleSheet.create({
    bluecont: {
      paddingTop: 15,
      paddingHorizontal: 15,
      width: '100%',
      height: 140,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      
      elevation: 5, 
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.20, 
      shadowRadius: 20, 
      backgroundColor: 'white'
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      marginTop: 30,
    },
  
    container2: {
      marginTop: 40,
      flexDirection: "row",
      height: 60,
      padding: 10,
      marginLeft: 5,
      marginRight: 5,
      alignItems: "center",
      marginBottom: 10, 
    },
    container21: {
      flex: 1,
      flexDirection: "column",
      padding: 5,
      marginLeft: 5,
    },
    container211: {
      flexDirection: "row",
      width: 200,
    },
    editButton: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "",
  
    },
    textButton: {
      color: "white",
      fontSize: 12,
      fontFamily: 'Poppins',
    },
    textJoin:{
      fontSize: 12,
      fontFamily: 'Poppins',
    },
  
    con3: {
      flexDirection: "column",
      marginTop: - 20,
     
      paddingLeft: 20,
      paddingRight: 20,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      borderRadius: 12,
      backgroundColor: "#F2F4F7",
      marginVertical: 10,
      paddingLeft: 10,
    },
    searchInput: {
      flex: 1,
      height: 50,
      fontSize: 15,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems:'center',
      padding: 10,
    },
    container4:{
      marginTop: 10,
      flexDirection: 'column',
      padding: 10.
    },
  
    container41:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 15,
    },
  
    specialtyButton:{
      backgroundColor: '#F9F5FF',
      width: '48%',
      height: 120,
      aspectRatio: 1,
      marginBottom: 15,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: '#FFFFFF',
    },
    container42:{
  
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     
    },
    images:{
      width: 90,
      height: 90, 
    
    },
  
    buttonText:{
      fontFamily:"Poppins",
      fontSize: 15,
      bottom: 0,
      textAlign: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
    },
    scrollContainer: {
      backgroundColor: '#FFFFFF',
      flexGrow: 1,
  
    },

    postContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      borderRadius: 12,
      backgroundColor: "#F2F4F7",
      marginVertical: 10,
      paddingLeft: 10,
    },
    postInput: {
      flex: 1,
      height: 50,
      fontSize: 15,
    },

    announcementContainer:{
      backgroundColor: '#F9F5FF',

     
      marginBottom: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: '#FFFFFF',
      padding: 10,
    },
    buttonPostContainer:{
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      padding: 10,
      backgroundColor: '#92A3FD',
      overflow: 'hidden',
      height: 60,
      justifyContent: 'center',
    },
    postButtonText:{
      color: 'white',
      fontFamily: 'Poppins-SemiBold'
    },
    postButton:{

      fontFamily: 'Poppins'
    }
});
export const DoctorProfileStyles = StyleSheet.create({
  textProfile:{
    fontFamily: 'Poppins', 
    fontSize: 14,
    color: '#888888' 
  },
  iconStyle:{
    textAlign:'center', 
    alignItems:'center',  
    marginRight: 10, 
    color: '#92A3FD'
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 30,
  },
  title:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
  },
  con1: {
  },
  container2: {
    marginTop: -10,
    flexDirection: "row",
    height: 50,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    marginBottom: 10, 
  },
  container21: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    marginLeft: 5,
  },
  container211: {
    flexDirection: "row",
    width: 200,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "",
  
  },
  textButton: {
    color: "white",
    fontSize: 9,
    fontFamily: 'Poppins',
  },
  textJoin:{
    fontSize: 9,
    fontFamily: 'Poppins',
  },
  container3: {
    marginTop:10,
    padding: 10,
    alignItems: "center",
    flex: 1,
  },
  settings: {
    backgroundColor: '#F9F5FF',

     width: '98%',
      
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: '#FFFFFF',
      padding: 20, 
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  settingContainer: {
    padding: 2,
    flex: 1, 
  },
  container31: {
    flex: 1,
    paddingTop: 10,
    
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  
  //   Container 4
  container4: {
    padding: 10,
    alignItems: "center",
    flex: 1,
  },
  settings4: {
    backgroundColor: '#F9F5FF',

     width: '98%',
      marginBottom: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      backgroundColor: '#FFFFFF',
      padding: 20, // Set borderWidth to 0
  },
  settingItem4: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  settingContainer4: {
    padding: 2,
    flex: 1, 
  },
  container314: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  
  scrollContainer: {
    flexGrow: 1,
  },
});
export const DoctorNotificationStyle = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,

  },
  arrowButton: {
    padding: 10,
  },

  title: {
    fontSize: 20,
    fontFamily:'Poppins-SemiBold',
    textAlign: 'center',
   
  },
  container1:{
    padding: 20,
  },
  container12:{
    borderTopWidth: 0.2,
    marginTop: 10,
    flexDirection: 'column'
    
  },
  
  containerCancel:{
      marginTop: 20,
      padding: 10,
      borderRadius: 5,

      backgroundColor: 'rgba(241, 58, 58, 0.822)'
  
  },
  cancelText: {
    color: 'white',
    fontFamily: 'Poppins', 
  },

  containerNewApp:{
    marginTop: 20,
    padding: 10,
    borderRadius: 5,

    backgroundColor: 'rgba(27, 170, 39, 0.822)'

},
newAppText: {
  color: 'white',
  fontFamily: 'Poppins', 
},
});