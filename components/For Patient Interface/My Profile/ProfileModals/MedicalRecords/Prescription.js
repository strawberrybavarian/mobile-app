import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Button, Divider, Portal, Dialog, IconButton, useTheme } from 'react-native-paper';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO, isValid } from 'date-fns';
import sd from '../../../../../utils/styleDictionary';

// Placeholder prescription when no records exist
const placeholderPrescription = {
  _id: 'placeholder',
  appointment: {
    date: new Date().toISOString()
  },
  doctor: {
    doctor_firstName: 'Sample',
    doctor_lastName: 'Doctor'
  },
  medications: [
    {
      name: 'Amoxicillin',
      type: 'Tablet',
      dosage: '500mg',
      frequency: 'Three times a day',
      duration: '7 days',
      instruction: 'Take after meals',
      notes: 'Avoid dairy products 2 hours before and after taking'
    },
    {
      name: 'Paracetamol',
      type: 'Tablet',
      dosage: '500mg',
      frequency: 'Every 6 hours as needed',
      duration: '5 days',
      instruction: 'Take with water',
      notes: 'Do not exceed 4 tablets in 24 hours'
    }
  ],
  status: 'active',
  expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
  generalNotes: 'Complete the full course of antibiotics even if you feel better before completion.'
};

const Prescriptions = ({patient}) => {
  const theme = useTheme();
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    if (patient && patient.prescriptions && patient.prescriptions.length > 0) {
      setPrescriptions(patient.prescriptions);
      setShowPlaceholder(false);
    } else {
      setPrescriptions([]);
      setShowPlaceholder(true);
    }
  }, [patient]);

  const openDetailModal = (prescription) => {
    setSelectedPrescription(prescription);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedPrescription(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) throw new Error('Invalid date');
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      case 'expired':
        return '#F44336'; // Red
      default:
        return '#757575'; // Grey
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  };
  
  const renderMedicationItem = (medication, index) => {
    return (
      <View key={index} style={modalStyles.medicationItem}>
        <View style={modalStyles.medicationHeader}>
          <Text style={modalStyles.medicationName}>{medication.name}</Text>
          <Text style={modalStyles.medicationType}>{medication.type}</Text>
        </View>
        
        <Divider style={modalStyles.medicationDivider} />
        
        <View style={modalStyles.medicationDetails}>
          <View style={modalStyles.detailRow}>
            <View style={modalStyles.detailItem}>
              <Text style={modalStyles.detailLabel}>Dosage</Text>
              <Text style={modalStyles.detailValue}>{medication.dosage}</Text>
            </View>
            <View style={modalStyles.detailItem}>
              <Text style={modalStyles.detailLabel}>Duration</Text>
              <Text style={modalStyles.detailValue}>{medication.duration}</Text>
            </View>
          </View>
          
          <View style={modalStyles.fullDetailItem}>
            <Text style={modalStyles.detailLabel}>Frequency</Text>
            <Text style={modalStyles.detailValue}>{medication.frequency}</Text>
          </View>
          
          <View style={modalStyles.fullDetailItem}>
            <Text style={modalStyles.detailLabel}>Instructions</Text>
            <Text style={modalStyles.detailValue}>{medication.instruction}</Text>
          </View>
          
          {medication.notes && (
            <View style={modalStyles.fullDetailItem}>
              <Text style={modalStyles.detailLabel}>Notes</Text>
              <Text style={modalStyles.detailValue}>{medication.notes}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPrescriptionCards = () => {
    const displayPrescriptions = showPlaceholder ? [placeholderPrescription] : prescriptions;
    
    return displayPrescriptions.map((prescription, index) => (
      <TouchableOpacity
        key={prescription._id || index}
        activeOpacity={0.7}
        onPress={() => openDetailModal(prescription)}
        style={cardStyles.touchableContainer}
      >
        <Card style={cardStyles.card}>
          <View style={cardStyles.contentWrapper}>
            {showPlaceholder && (
              <View style={cardStyles.placeholderBanner}>
                <Text style={cardStyles.placeholderText}>Sample</Text>
              </View>
            )}
            <Card.Content style={cardStyles.contentContainer}>
              <View style={cardStyles.headerContainer}>
                <View>
                  <Text style={cardStyles.date}>
                    {formatDate(prescription.appointment?.date || prescription.createdAt)}
                  </Text>
                  <Text style={cardStyles.title}>
                    {prescription.medications && prescription.medications.length > 0 
                      ? `${prescription.medications.length} Medication${prescription.medications.length > 1 ? 's' : ''}` 
                      : 'Prescription'}
                  </Text>
                </View>

                <View style={cardStyles.statusContainer}>
                  <View 
                    style={[
                      cardStyles.statusBadge, 
                      {backgroundColor: getStatusColor(prescription.status)}
                    ]}
                  >
                    <Text style={cardStyles.statusText}>
                      {getStatusText(prescription.status)}
                    </Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.primary} />
                </View>
              </View>

              <Divider style={cardStyles.divider} />
              
              <View style={cardStyles.medicationsPreview}>
                {prescription.medications && prescription.medications.slice(0, 2).map((med, idx) => (
                  <View key={idx} style={cardStyles.medicationRow}>
                    <MaterialCommunityIcons name="pill" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                    <View style={cardStyles.medicationTextContainer}>
                      <Text style={cardStyles.medicationName}>{med.name}</Text>
                      <Text style={cardStyles.medicationDetails}>
                        {med.dosage}, {med.frequency}
                      </Text>
                    </View>
                  </View>
                ))}
                
                {prescription.medications && prescription.medications.length > 2 && (
                  <Text style={cardStyles.moreText}>
                    + {prescription.medications.length - 2} more medication{prescription.medications.length - 2 > 1 ? 's' : ''}
                  </Text>
                )}
              </View>
              
              {prescription.expiryDate && (
                <View style={cardStyles.expiryContainer}>
                  <Text style={cardStyles.expiryLabel}>Expires:</Text>
                  <Text style={cardStyles.expiryDate}>
                    {formatDate(prescription.expiryDate)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </View>
        </Card>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {prescriptions.length > 0 || showPlaceholder ? (
        renderPrescriptionCards()
      ) : (
        <Text style={styles.noPrescriptions}>No prescription records found.</Text>
      )}
      
      <Portal>
        <Dialog 
          visible={detailModalVisible} 
          onDismiss={closeDetailModal}
          style={modalStyles.dialog}
        >
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Prescription Details</Text>
            <IconButton 
              icon="close" 
              size={20} 
              onPress={closeDetailModal}
              style={modalStyles.closeButton}
            />
          </View>
          
          <Dialog.ScrollArea style={modalStyles.scrollArea}>
            <ScrollView contentContainerStyle={modalStyles.scrollContent}>
              {selectedPrescription && (
                <>
                  <View style={modalStyles.header}>
                    <View style={modalStyles.headerRow}>
                      <Text style={modalStyles.date}>
                        {formatDate(selectedPrescription.appointment?.date || selectedPrescription.createdAt)}
                      </Text>
                      <View 
                        style={[
                          modalStyles.statusBadge, 
                          {backgroundColor: getStatusColor(selectedPrescription.status)}
                        ]}
                      >
                        <Text style={modalStyles.statusText}>
                          {getStatusText(selectedPrescription.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={modalStyles.prescriptionTitle}>
                      Prescription
                    </Text>
                    {selectedPrescription.doctor && (
                      <Text style={modalStyles.doctorName}>
                        Prescribed by Dr. {selectedPrescription.doctor.doctor_firstName || ''} {selectedPrescription.doctor.doctor_lastName || ''}
                      </Text>
                    )}
                    {selectedPrescription.expiryDate && (
                      <Text style={modalStyles.expiryNote}>
                        Valid until {formatDate(selectedPrescription.expiryDate)}
                      </Text>
                    )}
                  </View>
                  
                  <View style={modalStyles.sectionContainer}>
                    <Text style={modalStyles.sectionTitle}>Medications</Text>
                    <Divider style={modalStyles.sectionDivider} />
                    
                    <View style={modalStyles.medicationsContainer}>
                      {selectedPrescription.medications && selectedPrescription.medications.map((medication, index) => (
                        renderMedicationItem(medication, index)
                      ))}
                    </View>
                  </View>
                  
                  {selectedPrescription.generalNotes && (
                    <View style={modalStyles.sectionContainer}>
                      <Text style={modalStyles.sectionTitle}>General Notes</Text>
                      <Divider style={modalStyles.sectionDivider} />
                      
                      <View style={modalStyles.notesContainer}>
                        <Text style={modalStyles.notesText}>{selectedPrescription.generalNotes}</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </Dialog.ScrollArea>
          
          <Dialog.Actions style={modalStyles.actions}>
            <Button 
              mode="contained" 
              onPress={closeDetailModal}
              style={modalStyles.closeModalButton}
              contentStyle={modalStyles.closeModalButtonContent}
              labelStyle={modalStyles.closeModalButtonLabel}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  noPrescriptions: {
    fontFamily: sd.fonts.regular,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic'
  }
});

const cardStyles = StyleSheet.create({
  touchableContainer: {
    marginBottom: 12,
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
  },
  contentWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderBanner: {
    position: 'absolute',
    right: -28,
    top: 15,
    backgroundColor: '#FFC107',
    paddingHorizontal: 20,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
    width: 110,
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#FFF',
    textAlign: 'center',
  },
  title: {
    fontFamily: sd.fonts.bold,
    fontSize: 17,
    color: '#333',
  },
  date: {
    fontFamily: sd.fonts.regular,
    fontSize: 12,
    color: '#757575',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontFamily: sd.fonts.medium,
  },
  medicationsPreview: {
    marginTop: 5,
  },
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  medicationTextContainer: {
    flex: 1,
  },
  medicationName: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#333',
  },
  medicationDetails: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#757575',
  },
  moreText: {
    fontSize: 12,
    fontFamily: sd.fonts.italic,
    color: '#757575',
    marginTop: 4,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  expiryLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#757575',
    marginRight: 4,
  },
  expiryDate: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#F44336', // Red color for expiry
  }
});

const modalStyles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    maxHeight: '90%',
    marginTop: 0,
    marginBottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontFamily: sd.fonts.bold,
    fontSize: 20,
    color: '#333',
  },
  closeButton: {
    margin: -8,
  },
  scrollArea: {
    paddingHorizontal: 0,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#757575',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontFamily: sd.fonts.medium,
  },
  prescriptionTitle: {
    fontFamily: sd.fonts.bold,
    fontSize: 22,
    marginTop: 4,
    color: '#333',
  },
  doctorName: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  expiryNote: {
    fontFamily: sd.fonts.italic,
    fontSize: 13,
    color: '#F44336',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: sd.fonts.bold,
    fontSize: 18,
    color: '#333',
  },
  sectionDivider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  medicationsContainer: {
    marginTop: 8,
  },
  medicationItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  medicationName: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 16,
    color: '#333',
  },
  medicationType: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#757575',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  medicationDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  medicationDetails: {
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    marginRight: 12,
  },
  fullDetailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: sd.fonts.regular,
    fontSize: 16,
    color: '#333',
  },
  notesContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginTop: 8,
  },
  notesText: {
    fontFamily: sd.fonts.italic,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  actions: {
    padding: 16,
    justifyContent: 'center',
  },
  closeModalButton: {
    width: '100%',
    borderRadius: 8,
  },
  closeModalButtonContent: {
    height: 48,
  },
  closeModalButtonLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 16,
  }
});

export default Prescriptions;