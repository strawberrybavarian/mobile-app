import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Divider, List, Button, useTheme, Chip } from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import sd from '../../../../utils/styleDictionary';
import { format, parseISO } from 'date-fns';

const Immunizations = ({ displayInfo }) => {
  const [expandedId, setExpandedId] = useState(null);
  const theme = useTheme();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!displayInfo || displayInfo.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="syringe" size={50} color="#ccc" />
        <Text style={styles.emptyText}>No immunization records available</Text>
        <Text style={styles.emptySubtext}>
          Immunization records will appear here when they are added
        </Text>
      </View>
    );
  }

  // Check if displayInfo is an array or object and handle accordingly
  const immunizationItems = Array.isArray(displayInfo) ? displayInfo : [displayInfo];

  // Format the date
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString || 'Date not available';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {immunizationItems.map((item, index) => {
        const id = item._id || `immunization-${index}`;
        const isExpanded = expandedId === id;
        const isCompleted = item.doseNumber === item.totalDoses;
        
        return (
          <Card 
            key={id} 
            style={[styles.immunizationCard, { borderLeftColor: isCompleted ? '#4CAF50' : '#FFC107', borderLeftWidth: 4 }]}
            elevation={2}
          >
            <TouchableOpacity onPress={() => toggleExpand(id)}>
              <View style={styles.cardHeader}>
                <View style={[styles.headerIconContainer, {
                  backgroundColor: isCompleted ? '#E8F5E9' : '#FFF8E1',
                }]}>
                  <FontAwesome5 
                    name="syringe" 
                    size={20} 
                    color={isCompleted ? '#4CAF50' : '#FFC107'} 
                  />
                </View>
                <View style={styles.headerContent}>
                  <Text style={styles.title}>
                    {item.vaccineName || `Vaccine ${index + 1}`}
                  </Text>
                  <View style={styles.badgeRow}>
                    <Chip 
                      style={[styles.statusChip, {
                        backgroundColor: isCompleted ? '#E8F5E9' : '#FFF8E1'
                      }]} 
                      textStyle={{
                        color: isCompleted ? '#4CAF50' : '#FFC107',
                        fontSize: 12,
                        fontFamily: sd.fonts.medium
                      }}
                    >
                      Dose {item.doseNumber || 1} of {item.totalDoses || 1}
                    </Chip>
                    <Text style={styles.dateText}>
                      {formatDate(item.dateAdministered)}
                    </Text>
                  </View>
                </View>
                <MaterialIcons 
                  name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={24} 
                  color="#666"
                />
              </View>
            </TouchableOpacity>
            
            {isExpanded && (
              <Card.Content style={styles.expandedContent}>
                <Divider style={styles.divider} />
                
                {/* Vaccine Info */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Lot Number:</Text>
                    <Text style={styles.infoValue}>{item.lotNumber || 'Not specified'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Site:</Text>
                    <Text style={styles.infoValue}>{item.siteOfAdministration || 'Not specified'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Route:</Text>
                    <Text style={styles.infoValue}>{item.routeOfAdministration || 'Not specified'}</Text>
                  </View>
                </View>
                
                {/* Notes Section */}
                {item.notes && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <View style={styles.notesBox}>
                      <Text style={styles.sectionText}>{item.notes}</Text>
                    </View>
                  </View>
                )}
                
                {/* Administered By */}
                <View style={styles.footer}>
                  {item.administeredBy && (
                    <View style={styles.administeredByContainer}>
                      <FontAwesome5 name="user-md" size={16} color="#666" style={styles.footerIcon} />
                      <Text style={styles.administeredByText}>
                        Administered by: {
                          item.administeredBy.dr_firstName ? 
                          `Dr. ${item.administeredBy.dr_firstName} ${item.administeredBy.dr_lastName || ''}` : 
                          (item.administeredBy.doctor_firstName ? 
                            `Dr. ${item.administeredBy.doctor_firstName} ${item.administeredBy.doctor_lastName || ''}` : 
                            'Unknown')
                        }
                      </Text>
                    </View>
                  )}
                  
                  {/* If you want to add additional actions like updating the record
                  <Button
                    mode="outlined"
                    style={styles.actionButton}
                    icon="pencil"
                    onPress={() => console.log('Update record')}
                  >
                    Update
                  </Button> */}
                </View>
              </Card.Content>
            )}
          </Card>
        );
      })}
    </ScrollView>
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
    marginTop: 50,
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
  immunizationCard: {
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  headerIconContainer: {
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusChip: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 13,
    fontFamily: sd.fonts.regular,
    color: '#666',
  },
  expandedContent: {
    paddingBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    color: '#555',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#444',
    marginBottom: 8,
  },
  notesBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333',
    lineHeight: 20,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  administeredByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 8,
  },
  administeredByText: {
    fontSize: 13,
    fontFamily: sd.fonts.italic,
    color: '#666',
  },
  actionButton: {
    borderColor: '#2196F3',
    borderWidth: 1,
  },
});

export default Immunizations;