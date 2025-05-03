import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform, Share, ActivityIndicator, Clipboard, Modal, SafeAreaView } from 'react-native';
import { Card, Button, Divider, Portal, Dialog, useTheme, IconButton } from 'react-native-paper';
import { FontAwesome5, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { WebView } from 'react-native-webview';
import styles from './MedicalRecordsStyles';
import sd from '../../../../../utils/styleDictionary';
import { ip } from '../../../../../ContentExport';

const MedicalHistory = ({ patient }) => {
  const theme = useTheme();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (patient) {
      if (patient.patient_findings && patient.patient_findings.length > 0) {
        setMedicalHistory(patient.patient_findings);
      } else {
        setMedicalHistory([]);
      }
      setLoading(false);
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

  const generatePDF = async (finding) => {
    try {
      const recordDate = formatDate(finding.appointment?.date || finding.createdAt);
      const doctorName = `Dr. ${finding.doctor?.dr_firstName || finding.doctor?.doctor_firstName || ''} ${
        finding.doctor?.dr_middleInitial ? finding.doctor.dr_middleInitial + '. ' : ''
      }${finding.doctor?.dr_lastName || finding.doctor?.doctor_lastName || ''}`;

      const content = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Medical Record</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://unpkg.com/jspdf-autotable@3.5.28/dist/jspdf.plugin.autotable.js"></script>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    h1 { color: #2c3e50; text-align: center; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .btn { background: #4e73df; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; margin-top: 20px; font-size: 16px; display: block; width: 100%; }
    .btn-success { background: #1cc88a; }
    .data-section { margin: 15px 0; border: 1px solid #eee; padding: 15px; border-radius: 5px; }
    .section-title { font-weight: bold; color: #4e73df; margin-bottom: 10px; font-size: 18px; }
    .data-row { display: flex; flex-wrap: wrap; /* Allow wrapping of content */ margin-bottom: 8px; }
    .data-label { font-weight: bold; width: 40%; color: #555; word-wrap: break-word; /* Ensure long words wrap */ }
    .data-value { width: 60%; word-wrap: break-word; /* Ensure long words wrap */ overflow-wrap: break-word; /* Handle overflow for long words */ white-space: normal; /* Allow text to wrap to the next line */ }
    .centered { text-align: center; }
    .loading { display: none; text-align: center; margin-top: 20px; }
    .loading.active { display: block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Medical Record</h1>
    
    <div class="data-section">
      <div class="section-title">Patient Information</div>
      <div class="data-row">
        <div class="data-label">Date:</div>
        <div class="data-value">${recordDate}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Patient:</div>
        <div class="data-value">${patient?.patient_firstName || ''} ${patient?.patient_lastName || ''}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Doctor:</div>
        <div class="data-value">${doctorName}</div>
      </div>
    </div>
    
    <div class="data-section">
      <div class="section-title">Vital Signs</div>
      <div class="data-row">
        <div class="data-label">Blood Pressure:</div>
        <div class="data-value">${finding.bloodPressure ? 
          `${finding.bloodPressure.systole}/${finding.bloodPressure.diastole} mmHg` : 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Temperature:</div>
        <div class="data-value">${finding.temperature ? `${finding.temperature}°C` : 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Pulse Rate:</div>
        <div class="data-value">${finding.pulseRate ? `${finding.pulseRate} bpm` : 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Respiratory Rate:</div>
        <div class="data-value">${finding.respiratoryRate ? `${finding.respiratoryRate} bpm` : 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Weight:</div>
        <div class="data-value">${finding.weight ? `${finding.weight} kg` : 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Height:</div>
        <div class="data-value">${finding.height ? `${finding.height} cm` : 'N/A'}</div>
      </div>
    </div>
    
    <div class="data-section">
      <div class="section-title">Assessment</div>
      <div class="data-row">
        <div class="data-label">Assessment:</div>
        <div class="data-value">${finding.assessment || 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Interpretation:</div>
        <div class="data-value">${finding.interpretation || 'N/A'}</div>
      </div>
      <div class="data-row">
        <div class="data-label">Recommendations:</div>
        <div class="data-value">${finding.recommendations || 'N/A'}</div>
      </div>
    </div>
    
    <button class="btn" onclick="generatePDF()">Generate PDF</button>
    <div id="loading" class="loading">Generating PDF...</div>
    
    <div class="centered">
      <button class="btn btn-success" onclick="window.ReactNativeWebView.postMessage('share')">
        Share as Text
      </button>
    </div>
  </div>

  <script>
    function generatePDF() {
      document.getElementById('loading').className = 'loading active';
      
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(78, 115, 223);
        doc.text("MEDICAL RECORD", doc.internal.pageSize.width/2, 20, {align: 'center'});
        
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Date: ${recordDate}", 20, 35);
        doc.text("Patient: ${patient?.patient_firstName || ''} ${patient?.patient_lastName || ''}", 20, 42);
        doc.text("Doctor: ${doctorName}", 20, 49);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(78, 115, 223);
        doc.text("Vital Signs", 20, 60);
        
        doc.autoTable({
          startY: 65,
          head: [['Vital Sign', 'Value']],
          body: [
            ['Blood Pressure', '${finding.bloodPressure ? 
              `${finding.bloodPressure.systole}/${finding.bloodPressure.diastole} mmHg` : 'N/A'}'],
            ['Temperature', '${finding.temperature ? `${finding.temperature}°C` : 'N/A'}'],
            ['Pulse Rate', '${finding.pulseRate ? `${finding.pulseRate} bpm` : 'N/A'}'],
            ['Respiratory Rate', '${finding.respiratoryRate ? `${finding.respiratoryRate} bpm` : 'N/A'}'],
            ['Weight', '${finding.weight ? `${finding.weight} kg` : 'N/A'}'],
            ['Height', '${finding.height ? `${finding.height} cm` : 'N/A'}']
          ],
          headStyles: {
            fillColor: [220, 230, 242],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250]
          },
          margin: { left: 20, right: 20 }
        });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(28, 200, 138);
        doc.text("Assessment & Recommendations", 20, doc.autoTable.previous.finalY + 15);
        
        doc.autoTable({
          startY: doc.autoTable.previous.finalY + 20,
          head: [['Category', 'Details']],
          body: [
            ['Assessment', '${finding.assessment ? finding.assessment.replace(/'/g, "\\'") : 'N/A'}'],
            ['Interpretation', '${finding.interpretation ? finding.interpretation.replace(/'/g, "\\'") : 'N/A'}'],
            ['Recommendations', '${finding.recommendations ? finding.recommendations.replace(/'/g, "\\'") : 'N/A'}']
          ],
          headStyles: {
            fillColor: [220, 242, 230],
            textColor: [0, 100, 0],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 250, 247]
          },
          margin: { left: 20, right: 20 }
        });
        
        const pageCount = doc.internal.pages.length;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            "This is a digital medical record from Molino Polyclinic. Generated on ${new Date().toLocaleDateString()}.",
            doc.internal.pageSize.width/2,
            doc.internal.pageSize.height - 10,
            { align: "center" }
          );
        }
        
        const pdfDataUri = doc.output('datauristring');
        
        const iframe = document.createElement('iframe');
        iframe.src = pdfDataUri;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.zIndex = '9999';
        iframe.style.backgroundColor = 'rgba(0,0,0,0.9)';
        iframe.style.border = 'none';
        
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.position = 'fixed';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.zIndex = '10000';
        closeButton.style.padding = '8px 16px';
        closeButton.style.background = '#4e73df';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        
        const downloadButton = document.createElement('button');
        downloadButton.innerText = 'Download PDF';
        downloadButton.style.position = 'fixed';
        downloadButton.style.top = '10px';
        downloadButton.style.right = '100px';
        downloadButton.style.zIndex = '10000';
        downloadButton.style.padding = '8px 16px';
        downloadButton.style.background = '#1cc88a';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '4px';
        downloadButton.style.cursor = 'pointer';
        
        closeButton.onclick = function() {
          document.body.removeChild(iframe);
          document.body.removeChild(closeButton);
          document.body.removeChild(downloadButton);
        };
        
        downloadButton.onclick = function() {
          // Send the PDF data to React Native using the format your onMessage handler expects
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'pdf',
            data: pdfDataUri.split(',')[1],
            filename: "Medical_Record_" + (patient?.patient_lastName || 'Patient') + ".pdf"
          }));
        };
        
        document.body.appendChild(iframe);
        document.body.appendChild(closeButton);
        document.body.appendChild(downloadButton);
        
        document.getElementById('loading').className = 'loading';
      } catch (error) {
        console.error('PDF generation error:', error);
        document.getElementById('loading').className = 'loading';
        alert('Error generating PDF: ' + error.message);
      }
    }
  </script>
</body>
</html>`;

      setHtmlContent(content);
      setWebViewVisible(true);

    } catch (error) {
      console.error('Export Error:', error);
      Alert.alert(
        'Export Error',
        'Could not prepare the report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderDetailItem = (label, value) => {
    if (value === null || value === undefined || 
       (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    
    let formattedValue = value;
    
    if (typeof value === 'boolean') {
      formattedValue = value ? 'Yes' : 'No';
    }
    
    if (Array.isArray(value)) {
      formattedValue = value.join(', ');
    }
    
    return (
      <View style={modalStyles.detailItem} key={label}>
        <Text style={modalStyles.detailLabel}>{label}</Text>
        <Text style={modalStyles.detailValue}>{formattedValue}</Text>
      </View>
    );
  };

  const renderFindings = () => {
    return medicalHistory.map((finding, index) => (
      <TouchableOpacity
        key={finding._id || index}
        activeOpacity={0.7}
        onPress={() => openDetailModal(finding)}
        style={cardStyles.touchableContainer}
      >
        <Card style={cardStyles.card}>
          <View style={cardStyles.contentWrapper}>
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
      {loading ? (
        <View style={emptyStateStyles.emptyStateContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={emptyStateStyles.emptyStateMessage}>Loading medical records...</Text>
        </View>
      ) : medicalHistory.length > 0 ? (
        renderFindings()
      ) : (
        <View style={emptyStateStyles.emptyStateContainer}>
          <FontAwesome5 name="file-medical" size={50} color="#CCCCCC" style={emptyStateStyles.emptyStateIcon} />
          <Text style={emptyStateStyles.emptyStateTitle}>No Medical Records Found</Text>
          <Text style={emptyStateStyles.emptyStateMessage}>
            There are no medical records available for you at this time.
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
                      Dr. {selectedFinding.doctor?.dr_firstName || selectedFinding.doctor?.doctor_firstName || ''} {
                        selectedFinding.doctor?.dr_middleInitial ? selectedFinding.doctor.dr_middleInitial + '. ' : ''
                      }{selectedFinding.doctor?.dr_lastName || selectedFinding.doctor?.doctor_lastName || ''}
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
              mode="outlined" 
              icon={({color}) => <FontAwesome name="file-text-o" size={16} color={color} />}
              onPress={() => generatePDF(selectedFinding)}
              style={modalStyles.pdfButton}
              contentStyle={modalStyles.pdfButtonContent}
              labelStyle={modalStyles.pdfButtonLabel}
            >
              Export
            </Button>
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

      {/* WebView Modal */}
      <Modal
        visible={webViewVisible}
        animationType="slide"
        onRequestClose={() => setWebViewVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>
            <View style={webViewStyles.header}>
              <Text style={webViewStyles.headerTitle}>Medical Record</Text>
              <TouchableOpacity 
                onPress={() => setWebViewVisible(false)}
                style={webViewStyles.closeButton}
              >
                <FontAwesome name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <WebView
              source={{ html: htmlContent }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              originWhitelist={['*']}
              onMessage={(event) => {
                if (event.nativeEvent.data === 'share') {
                  const textReport = `MEDICAL RECORD\n\nDate: ${formatDate(selectedFinding.appointment?.date || selectedFinding.createdAt)}\nPatient: ${patient?.patient_firstName || ''} ${patient?.patient_lastName || ''}\nDoctor: Dr. ${selectedFinding.doctor?.dr_firstName || selectedFinding.doctor?.doctor_firstName || ''} ${selectedFinding.doctor?.dr_lastName || selectedFinding.doctor?.doctor_lastName || ''}\n\nVITAL SIGNS\nBlood Pressure: ${selectedFinding.bloodPressure ? `${selectedFinding.bloodPressure.systole}/${selectedFinding.bloodPressure.diastole} mmHg` : 'N/A'}\nTemperature: ${selectedFinding.temperature ? `${selectedFinding.temperature}°C` : 'N/A'}\nPulse Rate: ${selectedFinding.pulseRate ? `${selectedFinding.pulseRate} bpm` : 'N/A'}\n\nASSESSMENT\n${selectedFinding.assessment || 'N/A'}\n\nRECOMMENDATIONS\n${selectedFinding.recommendations || 'N/A'}`;
                  
                  Share.share({
                    title: 'Medical Record',
                    message: textReport
                  });
                } else if (event.nativeEvent.data.startsWith('{')) {
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'pdf') {
                      // Handle PDF base64 data
                      Share.share({
                        title: data.filename || 'Medical Record',
                        url: `data:application/pdf;base64,${data.data}`
                      });
                    }
                  } catch (e) {
                    console.error('Error parsing WebView message:', e);
                  }
                }
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    height: '90%',
    width: '94%',
    alignSelf: 'center',
    marginVertical: 0,
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeModalButton: {
    flex: 1,
    borderRadius: 8,
  },
  closeModalButtonContent: {
    height: 44,
  },
  pdfButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    borderColor: '#4CAF50',
  },
  pdfButtonContent: {
    height: 44,
  },
  pdfButtonLabel: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#4CAF50',
  },
});

const emptyStateStyles = StyleSheet.create({
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

const webViewStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
  },
  closeButton: {
    padding: 5,
  }
});

export default MedicalHistory;