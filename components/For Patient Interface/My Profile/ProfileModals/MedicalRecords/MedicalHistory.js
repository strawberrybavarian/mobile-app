import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button, Title, Paragraph, Divider, Portal, Dialog, List, useTheme, IconButton } from 'react-native-paper';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import styles from './MedicalRecordsStyles';
import sd from '../../../../../utils/styleDictionary';

// Placeholder finding when no findings exist
const placeholderFinding = {
  _id: 'placeholder',
  appointment: { 
    date: new Date().toISOString()
  },
  doctor: {
    doctor_firstName: 'Sample',
    doctor_lastName: 'Doctor'
  },
  bloodPressure: {
    systole: 120,
    diastole: 80
  },
  respiratoryRate: 16,
  pulseRate: 75,
  temperature: 36.5,
  weight: 70,
  height: 170,
  historyOfPresentIllness: {
    chiefComplaint: 'Regular check-up',
    currentSymptoms: ['None']
  },
  assessment: 'Healthy, no significant issues detected',
  remarks: 'Maintain healthy lifestyle and diet',
  interpretation: 'All vital signs within normal range',
  recommendations: 'Continue regular exercise, annual check-up recommended',
  lifestyle: {
    smoking: false,
    alcoholConsumption: false,
    others: ['Regular exercise']
  },
  familyHistory: [
    { relation: 'Father', condition: 'Hypertension' }
  ],
  allergy: ['None']
};

const MedicalHistory = ({ patient }) => {
  const theme = useTheme();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    if (patient && patient.patient_findings && patient.patient_findings.length > 0) {
      setMedicalHistory(patient.patient_findings);
      setShowPlaceholder(false);
    } else {
      setMedicalHistory([]);
      setShowPlaceholder(true);
    }
  }, [patient]);

  const openDetailModal = (finding) => {
    setSelectedFinding(finding);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedFinding(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  const renderDetailItem = (label, value) => {
    if (value === undefined || value === null || value === '') return null;
    
    if (Array.isArray(value) && value.length === 0) return null;
    
    if (typeof value === 'boolean') {
      value = value ? 'Yes' : 'No';
    }
    
    if (Array.isArray(value)) {
      value = value.join(', ');
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      return null;
    }
    
    return (
      <View style={modalStyles.detailItem}>
        <Text style={modalStyles.detailLabel}>{label}</Text>
        <Text style={modalStyles.detailValue}>{value}</Text>
      </View>
    );
  };

  const renderFindings = () => {
    const displayFindings = showPlaceholder ? [placeholderFinding] : medicalHistory;
    
    return displayFindings.map((finding, index) => (
      <TouchableOpacity
        key={finding._id || index}
        activeOpacity={0.7}
        onPress={() => openDetailModal(finding)}
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
                    {formatDate(finding.appointment?.date || finding.createdAt)}
                  </Text>
                  <Text style={cardStyles.title}>
                    {finding.historyOfPresentIllness?.chiefComplaint || 'Medical Check-up'}
                  </Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.primary} />
              </View>

              <Divider style={cardStyles.divider} />
              
              <View style={cardStyles.vitalContainer}>
                <View style={cardStyles.vitalGroup}>
                  <FontAwesome5 name="heartbeat" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.vitalLabel}>Blood Pressure</Text>
                    <Text style={cardStyles.vitalText}>
                      {finding.bloodPressure ? `${finding.bloodPressure.systole}/${finding.bloodPressure.diastole}` : 'N/A'}
                    </Text>
                  </View>
                </View>
                
                <View style={cardStyles.vitalGroup}>
                  <FontAwesome5 name="temperature-high" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.vitalLabel}>Temperature</Text>
                    <Text style={cardStyles.vitalText}>
                      {finding.temperature ? `${finding.temperature}°C` : 'N/A'}
                    </Text>
                  </View>
                </View>
                
                <View style={cardStyles.vitalGroup}>
                  <FontAwesome5 name="weight" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.vitalLabel}>Weight</Text>
                    <Text style={cardStyles.vitalText}>
                      {finding.weight ? `${finding.weight}kg` : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {finding.assessment && (
                <View style={cardStyles.assessmentContainer}>
                  <Text style={cardStyles.assessmentLabel}>Assessment:</Text>
                  <Text numberOfLines={2} style={cardStyles.assessment}>
                    {finding.assessment}
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
      {renderFindings()}
      
      <Portal>
        <Dialog 
          visible={detailModalVisible} 
          onDismiss={closeDetailModal}
          style={modalStyles.dialog}
        >
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Medical Record</Text>
            <IconButton 
              icon="close" 
              size={20} 
              onPress={closeDetailModal}
              style={modalStyles.closeButton}
            />
          </View>
          
          <Dialog.ScrollArea style={modalStyles.scrollArea}>
            <ScrollView contentContainerStyle={modalStyles.scrollContent}>
              {selectedFinding && (
                <>
                  <View style={modalStyles.header}>
                    <Text style={modalStyles.date}>
                      {formatDate(selectedFinding.appointment?.date || selectedFinding.createdAt)}
                    </Text>
                    <Text style={modalStyles.complaint}>
                      {selectedFinding.historyOfPresentIllness?.chiefComplaint || 'Medical Check-up'}
                    </Text>
                    <Text style={modalStyles.doctorName}>
                      Dr. {selectedFinding.doctor?.doctor_firstName || ''} {selectedFinding.doctor?.doctor_lastName || ''}
                    </Text>
                  </View>
                  
                  <View style={modalStyles.sectionContainer}>
                    <Text style={modalStyles.sectionTitle}>Vital Signs</Text>
                    <Divider style={modalStyles.sectionDivider} />
                    
                    <View style={modalStyles.vitalsContainer}>
                      <View style={modalStyles.vitalBox}>
                        <Text style={modalStyles.vitalLabel}>Blood Pressure</Text>
                        <Text style={modalStyles.vitalValue}>
                          {selectedFinding.bloodPressure ? 
                            `${selectedFinding.bloodPressure.systole}/${selectedFinding.bloodPressure.diastole} mmHg` : 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={modalStyles.vitalBox}>
                        <Text style={modalStyles.vitalLabel}>Temperature</Text>
                        <Text style={modalStyles.vitalValue}>
                          {selectedFinding.temperature ? `${selectedFinding.temperature}°C` : 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={modalStyles.vitalBox}>
                        <Text style={modalStyles.vitalLabel}>Pulse Rate</Text>
                        <Text style={modalStyles.vitalValue}>
                          {selectedFinding.pulseRate ? `${selectedFinding.pulseRate} bpm` : 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={modalStyles.vitalBox}>
                        <Text style={modalStyles.vitalLabel}>Respiratory Rate</Text>
                        <Text style={modalStyles.vitalValue}>
                          {selectedFinding.respiratoryRate ? `${selectedFinding.respiratoryRate} bpm` : 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={modalStyles.vitalBox}>
                        <Text style={modalStyles.vitalLabel}>Weight</Text>
                        <Text style={modalStyles.vitalValue}>
                          {selectedFinding.weight ? `${selectedFinding.weight} kg` : 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={modalStyles.vitalBox}>
                        <Text style={modalStyles.vitalLabel}>Height</Text>
                        <Text style={modalStyles.vitalValue}>
                          {selectedFinding.height ? `${selectedFinding.height} cm` : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={modalStyles.sectionContainer}>
                    <Text style={modalStyles.sectionTitle}>Doctor's Notes</Text>
                    <Divider style={modalStyles.sectionDivider} />
                    
                    <View style={modalStyles.detailsContainer}>
                      {renderDetailItem('Assessment', selectedFinding.assessment)}
                      {renderDetailItem('Interpretation', selectedFinding.interpretation)}
                      {renderDetailItem('Remarks', selectedFinding.remarks)}
                      {renderDetailItem('Recommendations', selectedFinding.recommendations)}
                    </View>
                  </View>
                  
                  <View style={modalStyles.sectionContainer}>
                    <Text style={modalStyles.sectionTitle}>Symptoms</Text>
                    <Divider style={modalStyles.sectionDivider} />
                    
                    <View style={modalStyles.detailsContainer}>
                      {selectedFinding.historyOfPresentIllness?.currentSymptoms && 
                        renderDetailItem('Current Symptoms', selectedFinding.historyOfPresentIllness.currentSymptoms)}
                    </View>
                  </View>
                  
                  <View style={modalStyles.sectionContainer}>
                    <Text style={modalStyles.sectionTitle}>Lifestyle & History</Text>
                    <Divider style={modalStyles.sectionDivider} />
                    
                    <View style={modalStyles.detailsContainer}>
                      {selectedFinding.lifestyle && (
                        <>
                          {renderDetailItem('Smoking', selectedFinding.lifestyle.smoking)}
                          {renderDetailItem('Alcohol Consumption', selectedFinding.lifestyle.alcoholConsumption)}
                          {renderDetailItem('Other Lifestyle Factors', selectedFinding.lifestyle.others)}
                        </>
                      )}
                      
                      {selectedFinding.familyHistory && selectedFinding.familyHistory.length > 0 && (
                        renderDetailItem('Family History', selectedFinding.familyHistory.map(h => 
                          `${h.relation}: ${h.condition}`
                        ))
                      )}
                      
                      {renderDetailItem('Allergies', selectedFinding.allergy)}
                    </View>
                  </View>
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
  vitalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  vitalGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  vitalLabel: {
    fontSize: 10,
    color: '#757575',
    fontFamily: sd.fonts.regular,
  },
  vitalText: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  assessmentContainer: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  assessmentLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#757575',
  },
  assessment: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#424242',
    marginTop: 2,
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
  date: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#757575',
  },
  complaint: {
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
  vitalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalBox: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  vitalLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  vitalValue: {
    fontFamily: sd.fonts.bold,
    fontSize: 16,
    color: '#333',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
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
  },
  listTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 14,
  },
  listDescription: {
    fontFamily: sd.fonts.regular,
    fontSize: 16,
  },
});

export default MedicalHistory;