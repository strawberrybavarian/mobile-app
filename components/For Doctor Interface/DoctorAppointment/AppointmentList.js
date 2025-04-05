// AppointmentList.js
import React from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  RefreshControl
} from 'react-native';
import { useTheme } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import sd from '../../../utils/styleDictionary';

const AppointmentList = ({ 
  appointments, 
  status, 
  setSelectedAppointment, 
  refreshing = false, 
  onRefresh = () => {} 
}) => {
  const theme = useTheme();

  // Create styles similar to the patient interface
  const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    cont: {
      padding: 16,
    },
    cardContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    dateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    monthText: {
      fontSize: 16,
      fontFamily: sd.fonts.medium,
      color: '#555',
    },
    dateText: {
      fontSize: 24,
      fontFamily: sd.fonts.bold,
      color: '#333',
    },
    divider: {
      width: 1,
      height: '100%',
      backgroundColor: '#ddd',
      marginHorizontal: 16,
    },
    infoContainer: {
      flex: 1,
    },
    patientName: {
      fontSize: 16,
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    dateTime: {
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: '#666',
      marginBottom: 4,
    },
    statusText: {
      fontSize: 14,
      fontFamily: sd.fonts.medium,
      color: theme.colors.primary,
    },
    noAppointments: {
      fontSize: 16,
      fontFamily: sd.fonts.regular,
      color: '#666',
      textAlign: 'center',
      marginTop: 10,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptySubText: {
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: '#999',
      marginTop: 8,
      textAlign: 'center',
    }
  });

  return (
    <ScrollView 
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
          title="Refreshing..."
          titleColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.cont}>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <TouchableOpacity
              style={styles.cardContainer}
              key={appointment._id}
              onPress={() => {
                console.log('Selected appointment:', appointment);
                setSelectedAppointment(appointment);
              }}
              activeOpacity={0.7}
            > 
              <View style={styles.cardContent}>
                {/* Date Section */}
                <View style={styles.dateContainer}>
                  <Text style={styles.monthText}>
                    {new Date(appointment.date).toLocaleString('en-US', { month: 'short' })}
                  </Text>
                  <Text style={styles.dateText}>
                    {new Date(appointment.date).toLocaleString('en-US', { day: '2-digit' })}
                  </Text>
                </View>
                
                {/* Divider */}
                <View style={styles.divider} />
                
                {/* Appointment Info */}
                <View style={styles.infoContainer}>
                  <Text style={styles.patientName}>
                    {appointment.patient?.patient_firstName || 'Unknown'} {appointment.patient?.patient_lastName || 'Patient'}
                  </Text>
                  <Text style={styles.dateTime}>
                    {new Date(appointment.date).toLocaleDateString('en-US')} | {appointment.time}
                  </Text>
                  <Text style={styles.statusText}>
                    Status: {appointment.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="calendar-times" size={40} color="#BDBDBD" />
            <Text style={styles.noAppointments}>No {status.toLowerCase()} appointments</Text>
            <Text style={styles.emptySubText}>Pull down to refresh</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default AppointmentList;