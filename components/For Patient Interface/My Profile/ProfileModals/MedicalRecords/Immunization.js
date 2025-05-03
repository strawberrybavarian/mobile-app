import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Card, Button, Divider, Portal, Dialog, IconButton, useTheme } from 'react-native-paper';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import sd from '../../../../../utils/styleDictionary';

// Add loading state
const Immunization = ({patient}) => {
  const theme = useTheme();
  const [immunizations, setImmunizations] = useState([]);
  const [selectedImmunization, setSelectedImmunization] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add this helper function to get vaccine badge color like the web version
  const getVaccineBadgeColor = (name) => {
    if (!name) return '#2196F3'; // Default blue
    
    const vaccineName = name.toLowerCase();
    if (vaccineName.includes('covid') || vaccineName.includes('coronavirus')) return '#F44336'; // Red
    if (vaccineName.includes('flu') || vaccineName.includes('influenza')) return '#FFC107'; // Yellow
    if (vaccineName.includes('hep') || vaccineName.includes('hepatitis')) return '#03A9F4'; // Light blue
    if (vaccineName.includes('tetanus') || vaccineName.includes('tdap')) return '#9E9E9E'; // Gray
    if (vaccineName.includes('mmr') || vaccineName.includes('measles')) return '#4CAF50'; // Green
    return '#2196F3'; // Default blue
  };

  useEffect(() => {
    if (patient) {
      if (patient.immunizations && patient.immunizations.length > 0) {
        setImmunizations(patient.immunizations);
      } else {
        setImmunizations([]);
      }
      setLoading(false);
    }
  }, [patient]);

  const openDetailModal = (immunization) => {
    setSelectedImmunization(immunization);
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedImmunization(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
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

  const renderImmunizationCards = () => {
    return immunizations.map((immunization, index) => (
      <TouchableOpacity
        key={immunization._id || index}
        activeOpacity={0.7}
        onPress={() => openDetailModal(immunization)}
        style={cardStyles.touchableContainer}
      >
        <Card style={cardStyles.card}>
          <View style={cardStyles.contentWrapper}>
            <Card.Content style={cardStyles.contentContainer}>
              <View style={cardStyles.headerContainer}>
                <View>
                  <Text style={cardStyles.date}>
                    {formatDate(immunization.dateAdministered || immunization.date)}
                  </Text>
                  <Text style={cardStyles.title}>
                    {immunization.vaccineName || immunization.immunizationName}
                  </Text>
                  <View style={[cardStyles.badge, {backgroundColor: getVaccineBadgeColor(immunization.vaccineName || immunization.immunizationName)}]}>
                    <Text style={cardStyles.badgeText}>
                      Dose {immunization.doseNumber || '1'}
                    </Text>
                  </View>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.primary} />
              </View>

              <Divider style={cardStyles.divider} />
              
              <View style={cardStyles.detailsContainer}>
                <View style={cardStyles.detailGroup}>
                  <FontAwesome5 name="syringe" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.detailLabel}>Dose</Text>
                    <Text style={cardStyles.detailText}>
                      {immunization.doseNumber ? 
                        `${immunization.doseNumber} of ${immunization.totalDoses || 'Unknown'}` : 'N/A'}
                    </Text>
                  </View>
                </View>
                
                <View style={cardStyles.detailGroup}>
                  <FontAwesome5 name="map-marker-alt" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.detailLabel}>Site</Text>
                    <Text style={cardStyles.detailText}>
                      {immunization.siteOfAdministration || 'N/A'}
                    </Text>
                  </View>
                </View>
                
                <View style={cardStyles.detailGroup}>
                  <FontAwesome5 name="user-md" size={16} color={theme.colors.primary} style={cardStyles.icon} />
                  <View>
                    <Text style={cardStyles.detailLabel}>Administered By</Text>
                    <Text style={cardStyles.detailText}>
                      {immunization.administeredBy ? 
                        `Dr. ${immunization.administeredBy.dr_firstName || immunization.administeredBy.doctor_firstName || ''} ${
                          immunization.administeredBy.dr_middleInitial ? immunization.administeredBy.dr_middleInitial + '. ' : ''
                        }${immunization.administeredBy.dr_lastName || immunization.administeredBy.doctor_lastName || ''}` : 
                        'Healthcare Provider'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </View>
        </Card>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ marginBottom: 20 }}>
      {loading ? (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.emptyStateMessage}>Loading immunization records...</Text>
        </View>
      ) : immunizations.length > 0 ? (
        renderImmunizationCards()
      ) : (
        <View style={styles.emptyStateContainer}>
          <FontAwesome5 name="syringe" size={50} color="#CCCCCC" style={styles.emptyStateIcon} />
          <Text style={styles.emptyStateTitle}>No Immunization Records Found</Text>
          <Text style={styles.emptyStateMessage}>
            You don't have any immunization records at this time.
          </Text>
        </View>
      )}
      
      <Portal>
        <Dialog 
          visible={detailModalVisible} 
          onDismiss={closeDetailModal}
          style={modalStyles.dialog}
        >
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Immunization Details</Text>
            <IconButton 
              icon="close" 
              size={20} 
              onPress={closeDetailModal}
              style={modalStyles.closeButton}
            />
          </View>
          
          <Dialog.ScrollArea style={modalStyles.scrollArea}>
            <ScrollView contentContainerStyle={modalStyles.scrollContent}>
              {selectedImmunization && (
                <>
                  <View style={modalStyles.header}>
                    <Text style={modalStyles.date}>
                      {formatDate(selectedImmunization.dateAdministered || selectedImmunization.date)}
                    </Text>
                    <Text style={modalStyles.vaccineName}>
                      {selectedImmunization.vaccineName || selectedImmunization.immunizationName}
                    </Text>
                    
                    {selectedImmunization.administeredBy && (
                      <Text style={modalStyles.doctorName}>
                        Administered by Dr. {selectedImmunization.administeredBy.doctor_firstName || ''} {selectedImmunization.administeredBy.doctor_lastName || ''}
                      </Text>
                    )}
                  </View>
                  
                  <View style={modalStyles.sectionContainer}>
                    <Text style={modalStyles.sectionTitle}>Vaccination Details</Text>
                    <Divider style={modalStyles.sectionDivider} />
                    
                    <View style={modalStyles.detailsContainer}>
                      {renderDetailItem('Dose Number', selectedImmunization.doseNumber)}
                      {renderDetailItem('Total Doses', selectedImmunization.totalDoses)}
                      {renderDetailItem('Lot Number', selectedImmunization.lotNumber)}
                      {renderDetailItem('Site of Administration', selectedImmunization.siteOfAdministration)}
                      {renderDetailItem('Route of Administration', selectedImmunization.routeOfAdministration)}
                    </View>
                  </View>
                  
                  {selectedImmunization.notes && (
                    <View style={modalStyles.sectionContainer}>
                      <Text style={modalStyles.sectionTitle}>Notes</Text>
                      <Divider style={modalStyles.sectionDivider} />
                      
                      <View style={modalStyles.notesContainer}>
                        <Text style={modalStyles.notesText}>{selectedImmunization.notes}</Text>
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
  noImmunizations: {
    fontFamily: sd.fonts.regular,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic'
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 2,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontFamily: sd.fonts.regular,
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
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
    // overflow: 'hidden',
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
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontFamily: sd.fonts.medium,
  }
});

const modalStyles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    margin: 0, // Remove margin
    // maxHeight: '90%', // Keep this for height limitation
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
    paddingBottom: 0, // Ensure no padding at bottom
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 8, // Add small padding at bottom
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
  vaccineName: {
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
    borderTopWidth: 1, // Add border for visual separation
    borderTopColor: '#f0f0f0',
    marginTop: 0, // Ensure no margin at top
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

export default Immunization;