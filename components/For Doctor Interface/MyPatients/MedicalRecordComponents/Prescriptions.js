import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Chip, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import sd from '../../../../utils/styleDictionary';

const Prescriptions = ({ displayInfo }) => {
  if (!displayInfo || displayInfo.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="medication" size={50} color="#ccc" />
        <Text style={styles.emptyText}>No prescription records available</Text>
      </View>
    );
  }

  // Check if displayInfo is an array or object and handle accordingly
  const prescriptionItems = Array.isArray(displayInfo) ? displayInfo : [displayInfo];

  return (
    <ScrollView style={styles.container}>
      {prescriptionItems.map((item, index) => (
        <Card key={item._id || index} style={styles.prescriptionCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Text style={styles.title}>
                {item.medication || `Prescription ${index + 1}`}
              </Text>
              {item.status && (
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </Chip>
              )}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dosage:</Text>
                <Text style={styles.detailValue}>{item.dosage || 'Not specified'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Frequency:</Text>
                <Text style={styles.detailValue}>{item.frequency || 'Not specified'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Start Date:</Text>
                <Text style={styles.detailValue}>
                  {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'Not specified'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>End Date:</Text>
                <Text style={styles.detailValue}>
                  {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Not specified'}
                </Text>
              </View>
              
              {item.instructions && (
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsLabel}>Instructions:</Text>
                  <Text style={styles.instructionsText}>{item.instructions}</Text>
                </View>
              )}
              
              <View style={styles.prescribedByContainer}>
                <Text style={styles.prescribedByText}>
                  Prescribed by: {item.prescribedBy || 'Unknown doctor'}
                </Text>
                <Text style={styles.prescribedDateText}>
                  {item.prescribedDate ? new Date(item.prescribedDate).toLocaleDateString() : ''}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return '#4CAF50'; // Green
    case 'completed':
      return '#2196F3'; // Blue
    case 'discontinued':
      return '#F44336'; // Red
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
  prescriptionCard: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: sd.fonts.bold,
    color: '#333',
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    fontSize: 12,
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
  instructionsContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  instructionsLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  instructionsText: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#333',
  },
  prescribedByContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prescribedByText: {
    fontFamily: sd.fonts.italic,
    fontSize: 12,
    color: '#666',
  },
  prescribedDateText: {
    fontFamily: sd.fonts.regular,
    fontSize: 12,
    color: '#888',
  },
});

export default Prescriptions;