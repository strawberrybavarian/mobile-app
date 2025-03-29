import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Divider, IconButton, Portal, Dialog, Button, useTheme } from 'react-native-paper';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import sd from '../../../../utils/styleDictionary';

const MedicalHistory = ({ displayInfo }) => {
  const theme = useTheme();
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Format date helper function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  // Handle detail item rendering in modal
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

  const openDetailModal = (finding) => {
    setSelectedFinding(finding);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
  };

  if (!displayInfo || displayInfo.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="file-medical" size={50} color="#ccc" />
        <Text style={styles.emptyText}>No medical history available</Text>
        <Text style={styles.emptySubtext}>
          This patient has no recorded medical history yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {displayInfo.map((finding, index) => (
        <TouchableOpacity
          key={finding._id || `finding-${index}`}
          activeOpacity={0.7}
          onPress={() => openDetailModal(finding)}
        >
          <Card style={[styles.findingCard, { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }]}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.dateText}>
                  {formatDate(finding.appointment?.date || finding.createdAt)}
                </Text>
                <Text style={styles.titleText}>
                  {finding.historyOfPresentIllness?.chiefComplaint || 'Medical Check-up'}
                </Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.primary} />
            </View>

            <Divider style={styles.divider} />
              
            <View style={styles.vitalSignsContainer}>
              <View style={styles.vitalGroup}>
                <FontAwesome5 name="heartbeat" size={16} color={theme.colors.primary} style={styles.icon} />
                <View>
                  <Text style={styles.vitalLabel}>Blood Pressure</Text>
                  <Text style={styles.vitalValue}>
                    {finding.bloodPressure ? `${finding.bloodPressure.systole}/${finding.bloodPressure.diastole}` : 'N/A'}
                  </Text>
                </View>
              </View>
                
              <View style={styles.vitalGroup}>
                <FontAwesome5 name="temperature-high" size={16} color={theme.colors.primary} style={styles.icon} />
                <View>
                  <Text style={styles.vitalLabel}>Temperature</Text>
                  <Text style={styles.vitalValue}>
                    {finding.temperature ? `${finding.temperature}°C` : 'N/A'}
                  </Text>
                </View>
              </View>
                
              <View style={styles.vitalGroup}>
                <FontAwesome5 name="weight" size={16} color={theme.colors.primary} style={styles.icon} />
                <View>
                  <Text style={styles.vitalLabel}>Weight</Text>
                  <Text style={styles.vitalValue}>
                    {finding.weight ? `${finding.weight} kg` : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {finding.assessment && (
              <View style={styles.assessmentContainer}>
                <Text style={styles.assessmentLabel}>Assessment:</Text>
                <Text numberOfLines={2} style={styles.assessment}>
                  {finding.assessment}
                </Text>
              </View>
            )}
          </Card>
        </TouchableOpacity>
      ))}

      {/* Details Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#555',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  findingCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dateText: {
    fontFamily: sd.fonts.regular,
    fontSize: 12,
    color: '#757575',
  },
  titleText: {
    fontFamily: sd.fonts.bold,
    fontSize: 17,
    color: '#333',
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  vitalSignsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 12,
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
  vitalValue: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
  },
  assessmentContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 12,
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
  },
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
});

export default MedicalHistory;