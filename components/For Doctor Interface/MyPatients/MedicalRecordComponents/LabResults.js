import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Divider, DataTable, Button, List, useTheme } from 'react-native-paper';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import sd from '../../../../utils/styleDictionary';

const LabResults = ({ displayInfo }) => {
  const [expandedId, setExpandedId] = useState(null);
  const theme = useTheme();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!displayInfo || displayInfo.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="vial" size={50} color="#ccc" />
        <Text style={styles.emptyText}>No laboratory results available</Text>
        <Text style={styles.emptySubtext}>
          Laboratory tests will appear here when they are completed
        </Text>
      </View>
    );
  }

  // Check if displayInfo is an array or object and handle accordingly
  const labResultItems = Array.isArray(displayInfo) ? displayInfo : [displayInfo];

  return (
    <ScrollView style={styles.container}>
      {labResultItems.map((item, index) => {
        const id = item._id || `lab-${index}`;
        const isExpanded = expandedId === id;
        
        // Format the date nicely
        const testDate = item.date ? 
          new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          }) : 'Date not available';

        return (
          <Card 
            key={id} 
            style={[styles.labResultCard, { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }]}
            elevation={2}
          >
            <TouchableOpacity onPress={() => toggleExpand(id)}>
              <View style={styles.cardHeader}>
                <View style={styles.headerIconContainer}>
                  <FontAwesome5 name="vial" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.headerContent}>
                  <Text style={styles.title}>
                    {item.testName || `Laboratory Test ${index + 1}`}
                  </Text>
                  <Text style={styles.dateText}>
                    {testDate}
                  </Text>
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
                
                {/* Lab Info Section */}
                <View style={styles.labInfoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Laboratory:</Text>
                    <Text style={styles.infoValue}>{item.labName || 'Not specified'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Referred By:</Text>
                    <Text style={styles.infoValue}>
                      {item.referredBy || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Specimen:</Text>
                    <Text style={styles.infoValue}>
                      {item.specimenType || 'Not specified'}
                    </Text>
                  </View>
                </View>
                
                {/* Description Section */}
                {item.testDescription && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.sectionText}>{item.testDescription}</Text>
                  </View>
                )}
                
                {/* Results Table */}
                {item.results && item.results.length > 0 && (
                  <View style={styles.resultsSection}>
                    <Text style={styles.sectionTitle}>Test Results</Text>
                    
                    <DataTable style={styles.dataTable}>
                      <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title style={{flex: 2}}>Parameter</DataTable.Title>
                        <DataTable.Title numeric>Result</DataTable.Title>
                        <DataTable.Title numeric style={{flex: 1.5}}>Reference Range</DataTable.Title>
                        <DataTable.Title>Status</DataTable.Title>
                      </DataTable.Header>
                      
                      {item.results.map((result, idx) => (
                        <DataTable.Row key={idx} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                          <DataTable.Cell style={{flex: 2}}>{result.parameter || 'N/A'}</DataTable.Cell>
                          <DataTable.Cell numeric>{result.value || 'N/A'}</DataTable.Cell>
                          <DataTable.Cell numeric style={{flex: 1.5}}>{result.referenceRange || 'N/A'}</DataTable.Cell>
                          <DataTable.Cell>
                            <View style={styles.statusContainer}>
                              <View style={[styles.statusIndicator, { 
                                backgroundColor: getStatusColor(result.status) 
                              }]} />
                              <Text style={styles.statusText}>{result.status || 'N/A'}</Text>
                            </View>
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </View>
                )}
                
                {/* Interpretation */}
                {item.interpretation && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Interpretation</Text>
                    <View style={styles.interpretationBox}>
                      <Text style={styles.sectionText}>{item.interpretation}</Text>
                    </View>
                  </View>
                )}
                
                {/* Verification */}
                <View style={styles.footer}>
                  {item.doctor && (
                    <View style={styles.verifiedByContainer}>
                      <FontAwesome5 name="user-md" size={16} color="#666" style={styles.footerIcon} />
                      <Text style={styles.verifiedByText}>
                        Verified by: {item.doctor.dr_firstName ? 
                          `Dr. ${item.doctor.dr_firstName} ${item.doctor.dr_lastName || ''}` : 
                          (item.doctor.name || 'Unknown')}
                      </Text>
                    </View>
                  )}
                  
                  {/* Download button or additional actions could go here */}
                  {/* <Button
                    mode="outlined"
                    style={styles.downloadButton}
                    icon="download"
                    onPress={() => console.log('Download report')}
                  >
                    Download PDF
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

const getStatusColor = (status) => {
  if (!status) return '#9E9E9E'; // Grey for undefined
  
  status = status.toLowerCase();
  if (status === 'normal' || status === 'negative') return '#4CAF50'; // Green
  if (status === 'abnormal' || status === 'positive') return '#F44336'; // Red
  if (status === 'borderline') return '#FFC107'; // Yellow/Amber
  
  return '#9E9E9E'; // Default grey
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
  labResultCard: {
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
    backgroundColor: '#E3F2FD',
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
  },
  dateText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
    marginTop: 2,
  },
  expandedContent: {
    paddingBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  labInfoContainer: {
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
  sectionText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333',
    lineHeight: 20,
  },
  interpretationBox: {
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB74D',
  },
  resultsSection: {
    marginBottom: 16,
  },
  dataTable: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  rowEven: {
    backgroundColor: '#fff',
  },
  rowOdd: {
    backgroundColor: '#fafafa',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#555',
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 8,
  },
  verifiedByText: {
    fontSize: 13,
    fontFamily: sd.fonts.italic,
    color: '#666',
  },
  downloadButton: {
    borderColor: '#2196F3',
    borderWidth: 1,
  },
});

export default LabResults;