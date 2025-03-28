import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Card, Button, Divider, Portal, Dialog, IconButton, ActivityIndicator, useTheme } from 'react-native-paper';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ip } from '../../../../../ContentExport';
import sd from '../../../../../utils/styleDictionary';

// Placeholder lab result when no records exist
const placeholderLabResult = {
  _id: 'placeholder',
  title: 'Complete Blood Count (CBC)',
  date: new Date().toISOString(),
  doctor: {
    doctor_firstName: 'Sample',
    doctor_lastName: 'Doctor'
  },
  file: {
    path: 'samples/lab_result_sample.pdf',
    filename: 'sample_cbc_result.pdf'
  },
  testType: 'Blood Test',
  labLocation: 'Main Hospital Laboratory',
  results: [
    { name: 'Hemoglobin', value: '14.2 g/dL', normalRange: '13.5-17.5 g/dL', status: 'Normal' },
    { name: 'White Blood Cell Count', value: '7.8 x10^9/L', normalRange: '4.5-11.0 x10^9/L', status: 'Normal' },
    { name: 'Platelet Count', value: '250 x10^9/L', normalRange: '150-450 x10^9/L', status: 'Normal' }
  ],
  interpretation: 'All values are within normal ranges. No significant abnormalities detected.'
};

const LabResult = ({patient}) => {
  const theme = useTheme();
  const [labResults, setLabResults] = useState([]);
  const [selectedLabResult, setSelectedLabResult] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient && patient.laboratoryResults && patient.laboratoryResults.length > 0) {
      setLabResults(patient.laboratoryResults);
      setShowPlaceholder(false);
    } else {
      setLabResults([]);
      setShowPlaceholder(true);
    }
  }, [patient]);

  const openDetailModal = (labResult) => {
    setSelectedLabResult(labResult);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedLabResult(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      try {
        // Try another format if direct ISO parsing fails
        return format(new Date(dateString), 'MMM dd, yyyy');
      } catch (err) {
        return dateString || 'N/A';
      }
    }
  };

  const openFile = async (fileUrl) => {
    if (!fileUrl) return;
    
    setLoading(true);
    try {
      const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${ip.address}/${fileUrl}`;
      const supported = await Linking.canOpenURL(fullUrl);
      
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        alert('Cannot open this file. File format may not be supported on your device.');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Failed to open the file. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderLabResultCards = () => {
    const displayResults = showPlaceholder ? [placeholderLabResult] : labResults;
    
    return displayResults.map((labResult, index) => (
      <TouchableOpacity
        key={labResult._id || index}
        activeOpacity={0.7}
        onPress={() => openDetailModal(labResult)}
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
                    {formatDate(labResult.date || labResult.createdAt)}
                  </Text>
                  <Text style={cardStyles.title}>
                    {labResult.title || 'Laboratory Result'}
                  </Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.primary} />
              </View>

              <Divider style={cardStyles.divider} />
              
              <View style={cardStyles.detailsContainer}>
                <View style={cardStyles.detailGroup}>
                  <FontAwesome5 name="flask" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.detailLabel}>Test Type</Text>
                    <Text style={cardStyles.detailText}>
                      {labResult.testType || 'Clinical Laboratory Test'}
                    </Text>
                  </View>
                </View>
                
                {labResult.doctor && (
                  <View style={cardStyles.detailGroup}>
                    <FontAwesome5 name="user-md" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                    <View>
                      <Text style={cardStyles.detailLabel}>Requested By</Text>
                      <Text style={cardStyles.detailText}>
                        {`Dr. ${labResult.doctor.doctor_firstName || ''} ${labResult.doctor.doctor_lastName || ''}`}
                      </Text>
                    </View>
                  </View>
                )}
                
                {labResult.file && (
                  <View style={cardStyles.detailGroup}>
                    <MaterialCommunityIcons name="file-document-outline" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                    <View>
                      <Text style={cardStyles.detailLabel}>File</Text>
                      <Text style={cardStyles.detailText}>
                        {labResult.file.filename || 'View Report'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Card.Content>
          </View>
        </Card>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {labResults.length > 0 || showPlaceholder ? (
        renderLabResultCards()
      ) : (
        <Text style={styles.noLabResults}>No laboratory results found.</Text>
      )}
      
      <Portal>
        <Dialog 
          visible={detailModalVisible} 
          onDismiss={closeDetailModal}
          style={modalStyles.dialog}
        >
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Laboratory Result</Text>
            <IconButton 
              icon="close" 
              size={20} 
              onPress={closeDetailModal}
              style={modalStyles.closeButton}
            />
          </View>
          
          <Dialog.ScrollArea style={modalStyles.scrollArea}>
            <ScrollView contentContainerStyle={modalStyles.scrollContent}>
              {selectedLabResult && (
                <>
                  <View style={modalStyles.header}>
                    <Text style={modalStyles.date}>
                      {formatDate(selectedLabResult.date || selectedLabResult.createdAt)}
                    </Text>
                    <Text style={modalStyles.testName}>
                      {selectedLabResult.title || 'Laboratory Result'}
                    </Text>
                    
                    {selectedLabResult.doctor && (
                      <Text style={modalStyles.doctorName}>
                        Ordered by Dr. {selectedLabResult.doctor.doctor_firstName || ''} {selectedLabResult.doctor.doctor_lastName || ''}
                      </Text>
                    )}
                  </View>
                  
                  {selectedLabResult.testType && (
                    <View style={modalStyles.sectionContainer}>
                      <Text style={modalStyles.sectionTitle}>Test Information</Text>
                      <Divider style={modalStyles.sectionDivider} />
                      
                      <View style={modalStyles.detailsContainer}>
                        <View style={modalStyles.detailItem}>
                          <Text style={modalStyles.detailLabel}>Test Type</Text>
                          <Text style={modalStyles.detailValue}>{selectedLabResult.testType}</Text>
                        </View>
                        
                        {selectedLabResult.labLocation && (
                          <View style={modalStyles.detailItem}>
                            <Text style={modalStyles.detailLabel}>Laboratory</Text>
                            <Text style={modalStyles.detailValue}>{selectedLabResult.labLocation}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                  
                  {selectedLabResult.results && selectedLabResult.results.length > 0 && (
                    <View style={modalStyles.sectionContainer}>
                      <Text style={modalStyles.sectionTitle}>Results</Text>
                      <Divider style={modalStyles.sectionDivider} />
                      
                      <View style={modalStyles.resultsContainer}>
                        <View style={modalStyles.resultHeader}>
                          <Text style={modalStyles.resultHeaderText}>Test</Text>
                          <Text style={modalStyles.resultHeaderText}>Result</Text>
                          <Text style={modalStyles.resultHeaderText}>Normal Range</Text>
                          <Text style={modalStyles.resultHeaderText}>Status</Text>
                        </View>
                        
                        {selectedLabResult.results.map((result, index) => (
                          <View key={index} style={modalStyles.resultRow}>
                            <Text style={modalStyles.resultCellTest}>{result.name}</Text>
                            <Text style={modalStyles.resultCellValue}>{result.value}</Text>
                            <Text style={modalStyles.resultCellRange}>{result.normalRange}</Text>
                            <Text 
                              style={[
                                modalStyles.resultCellStatus, 
                                { color: result.status === 'Normal' ? '#4CAF50' : '#F44336' }
                              ]}
                            >
                              {result.status}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {selectedLabResult.interpretation && (
                    <View style={modalStyles.sectionContainer}>
                      <Text style={modalStyles.sectionTitle}>Interpretation</Text>
                      <Divider style={modalStyles.sectionDivider} />
                      
                      <View style={modalStyles.interpretationContainer}>
                        <Text style={modalStyles.interpretationText}>{selectedLabResult.interpretation}</Text>
                      </View>
                    </View>
                  )}
                  
                  {selectedLabResult.file && selectedLabResult.file.path && (
                    <View style={modalStyles.sectionContainer}>
                      <Text style={modalStyles.sectionTitle}>Document</Text>
                      <Divider style={modalStyles.sectionDivider} />
                      
                      <Button
                        mode="outlined"
                        icon="file-document"
                        loading={loading}
                        disabled={loading}
                        onPress={() => openFile(selectedLabResult.file.path)}
                        style={modalStyles.fileButton}
                      >
                        View Full Report
                      </Button>
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
  noLabResults: {
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
  detailsContainer: {
    marginTop: 5,
    flexDirection: 'column',
  },
  detailGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#757575',
    fontFamily: sd.fonts.regular,
  },
  detailText: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#333',
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
  testName: {
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
  resultsContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  resultHeaderText: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
  resultRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  resultCellTest: {
    flex: 1,
    fontFamily: sd.fonts.medium,
    fontSize: 12,
    color: '#333',
  },
  resultCellValue: {
    flex: 1,
    fontFamily: sd.fonts.regular,
    fontSize: 12,
  },
  resultCellRange: {
    flex: 1,
    fontFamily: sd.fonts.regular,
    fontSize: 12,
    color: '#757575',
  },
  resultCellStatus: {
    flex: 1,
    fontFamily: sd.fonts.medium,
    fontSize: 12,
  },
  interpretationContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginTop: 8,
  },
  interpretationText: {
    fontFamily: sd.fonts.regular,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  fileButton: {
    marginTop: 8,
    borderRadius: 8,
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

export default LabResult;