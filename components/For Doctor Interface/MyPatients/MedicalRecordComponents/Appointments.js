import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Chip, Divider, Badge } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import sd from '../../../../utils/styleDictionary';

const Appointments = ({ displayInfo }) => {
  if (!displayInfo || displayInfo.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="calendar-today" size={50} color="#ccc" />
        <Text style={styles.emptyText}>No appointment records available</Text>
      </View>
    );
  }

  // Group appointments by status
  const groupedAppointments = {
    upcoming: [],
    completed: [],
    cancelled: [],
    pending: [],
  };

  displayInfo.forEach(appointment => {
    const status = appointment.status?.toLowerCase() || 'pending';
    if (status === 'scheduled' || status === 'confirmed') {
      groupedAppointments.upcoming.push(appointment);
    } else if (status === 'completed') {
      groupedAppointments.completed.push(appointment);
    } else if (status === 'cancelled') {
      groupedAppointments.cancelled.push(appointment);
    } else {
      groupedAppointments.pending.push(appointment);
    }
  });

  const renderAppointment = (appointment, index) => {
    return (
      <Card key={appointment._id || index} style={styles.appointmentCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.dateText}>
                {new Date(appointment.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.timeText}>{appointment.time}</Text>
            </View>
            
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) }]}
            >
              <Text style={styles.statusText}>{appointment.status}</Text>
            </Chip>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>
                {Array.isArray(appointment.appointment_type) 
                  ? appointment.appointment_type[0]?.appointment_type || 'Not specified'
                  : appointment.appointment_type?.appointment_type || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Doctor:</Text>
              <Text style={styles.detailValue}>
                {appointment.doctor?.dr_firstName && appointment.doctor?.dr_lastName
                  ? `Dr. ${appointment.doctor.dr_firstName} ${appointment.doctor.dr_lastName}`
                  : 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reason:</Text>
              <Text style={styles.detailValue}>{appointment.reason || 'Not provided'}</Text>
            </View>
            
            {appointment.followUp && (
              <View style={styles.followupContainer}>
                <Badge style={styles.followupBadge}>
                  <Text style={styles.followupText}>Follow-up Required</Text>
                </Badge>
              </View>
            )}
            
            {appointment.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes:</Text>
                <Text style={styles.notesText}>{appointment.notes}</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Upcoming Appointments */}
      {groupedAppointments.upcoming.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="event" size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          </View>
          {groupedAppointments.upcoming.map(renderAppointment)}
        </View>
      )}
      
      {/* Pending Appointments */}
      {groupedAppointments.pending.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="schedule" size={20} color="#FF9800" />
            <Text style={styles.sectionTitle}>Pending Appointments</Text>
          </View>
          {groupedAppointments.pending.map(renderAppointment)}
        </View>
      )}
      
      {/* Completed Appointments */}
      {groupedAppointments.completed.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Completed Appointments</Text>
          </View>
          {groupedAppointments.completed.map(renderAppointment)}
        </View>
      )}
      
      {/* Cancelled Appointments */}
      {groupedAppointments.cancelled.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="cancel" size={20} color="#F44336" />
            <Text style={styles.sectionTitle}>Cancelled Appointments</Text>
          </View>
          {groupedAppointments.cancelled.map(renderAppointment)}
        </View>
      )}
    </ScrollView>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
    case 'confirmed':
      return '#2196F3'; // Blue
    case 'completed':
      return '#4CAF50'; // Green
    case 'cancelled':
      return '#F44336'; // Red
    case 'pending':
      return '#FF9800'; // Orange
    default:
      return '#9E9E9E'; // Grey
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontFamily: sd.fonts.medium,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
  },
  appointmentCard: {
    marginBottom: 10,
    marginHorizontal: 3,
    borderRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'column',
  },
  dateText: {
    fontSize: 16,
    fontFamily: sd.fonts.bold,
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
  },
  // statusChip: {
  //   height: 'auto',
  // },
  statusText: {
    fontSize: sd.fonts.base,
    fontFamily: sd.fonts.medium,
    color: '#fff',
  },
  divider: {
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: '30%',
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    width: '70%',
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#333',
  },
  followupContainer: {
    marginTop: 10,
    paddingVertical: 10,
  },
  followupBadge: {
    backgroundColor: '#673AB7',
    paddingHorizontal: 15,
    paddingBottom: 20,

  },
  followupText: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fonts.base,
    color: '#fff',
    paddingBottom: 4,
    margin: 4,
  },
  notesContainer: {
    marginTop: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  notesLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#333',
  },
});

export default Appointments;