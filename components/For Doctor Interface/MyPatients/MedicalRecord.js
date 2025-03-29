import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Surface, useTheme, Card, Divider } from 'react-native-paper';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { ip } from '../../../ContentExport';
import sd from '../../../utils/styleDictionary';
import MedicalHistory from './MedicalRecordComponents/MedicalHistory';
import Appointments from './MedicalRecordComponents/Appointments';
import LabResults from './MedicalRecordComponents/LabResults';
import Immunizations from './MedicalRecordComponents/Immunizations';
import Prescriptions from './MedicalRecordComponents/Prescriptions';

const MedicalRecord = ({ patient, backToPatients }) => {
  const [displayInfo, setDisplayInfo] = useState(null);
  const [displayLabel, setDisplayLabel] = useState('medicalHistory');
  const theme = useTheme();

  // Initialize with the first option's data
  useEffect(() => {
    if (patient) {
      setDisplayInfo(patient?.medicalHistory || []);
    }
  }, [patient]);

  const dropdownArr = [
    { label: 'Medical History', value: 'medicalHistory', icon: 'history' },
    { label: 'Prescriptions', value: 'prescriptions', icon: 'medication' },
    { label: 'Appointments', value: 'appointments', icon: 'event' },
    { label: 'Lab Results', value: 'laboratoryResults', icon: 'science' },
    { label: 'Immunizations', value: 'immunizations', icon: 'vaccines' },
  ];

  if (!patient) {
    return null;
  }

  const handleDropdownChange = (item) => {
    setDisplayLabel(item.value);
    switch (item.value) {
      case 'medicalHistory':
        setDisplayInfo(patient?.medicalHistory || []);
        break;
      case 'prescriptions':
        setDisplayInfo(patient?.prescriptions || []);
        break;
      case 'appointments':
        setDisplayInfo(patient?.patient_appointments || []);
        break;
      case 'laboratoryResults':
        setDisplayInfo(patient?.labResults || []);
        break;
      case 'immunizations':
        setDisplayInfo(patient?.immunizations || []);
        break;
      default:
        setDisplayInfo([]);
    }
  };

  const getAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  // Find the current selected category icon
  const selectedCategory = dropdownArr.find(item => item.value === displayLabel);
  
  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.headerSurface}>
        <Pressable style={styles.backButton} onPress={backToPatients}>
          <Entypo name='chevron-left' size={20} color={theme.colors.primary} />
          <Text style={styles.backText}>Back to My Patients</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Patient Information Card */}
        <Card style={styles.patientCard}>
          <Card.Content>
            <View style={styles.patientHeader}>
              <Avatar.Image
                size={60}
                source={patient?.patient_image ? 
                  { uri: `${ip?.address}/${patient.patient_image}` } : 
                  require('../../../assets/pictures/default_avatar.png')}
                style={styles.avatar}
              />
              <View style={styles.patientHeaderInfo}>
                <Text style={styles.patientName}>
                  {patient.patient_firstName} {patient.patient_middleInitial ? `${patient.patient_middleInitial}. ` : ''}{patient.patient_lastName}
                </Text>
                <View style={styles.patientMetaContainer}>
                  <Text style={styles.patientMeta}>
                    {getAge(patient.patient_dob)} years • {patient.patient_gender}
                  </Text>
                  <Text style={styles.patientId}>
                    ID: {patient._id?.substring(0, 8)}
                  </Text>
                </View>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.patientDetailsGrid}>
              <View style={styles.patientDetailItem}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{patient.patient_contactNumber || 'Not provided'}</Text>
              </View>
              <View style={styles.patientDetailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{patient.patient_email || 'Not provided'}</Text>
              </View>
              <View style={styles.patientDetailItem}>
                <Text style={styles.detailLabel}>Blood Type</Text>
                <Text style={styles.detailValue}>{patient.patient_bloodType || 'Unknown'}</Text>
              </View>
              <View style={styles.patientDetailItem}>
                <Text style={styles.detailLabel}>Allergies</Text>
                <Text style={styles.detailValue}>{patient.patient_allergies?.length > 0 ? patient.patient_allergies.join(', ') : 'None reported'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Records Category Selection */}
        <Card style={styles.categoryCard}>
          <Card.Title 
            title="Medical Records" 
            titleStyle={styles.categoryTitle} 
          />
          <Card.Content>
            <Dropdown
              data={dropdownArr}
              labelField="label"
              valueField="value"
              value={displayLabel}
              placeholder='Select Record Type'
              onChange={handleDropdownChange}
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              iconStyle={styles.iconStyle}
              renderLeftIcon={() => (
                <MaterialIcons 
                  name={selectedCategory?.icon || 'folder'} 
                  size={20} 
                  color={theme.colors.primary}
                  style={styles.dropdownIcon}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        {/* Record Content */}
        <Card style={styles.contentCard}>
          <Card.Content>
            {displayLabel === 'medicalHistory' && <MedicalHistory displayInfo={displayInfo} />}
            {displayLabel === 'prescriptions' && <Prescriptions displayInfo={displayInfo} />}
            {displayLabel === 'appointments' && <Appointments displayInfo={displayInfo} />}
            {displayLabel === 'laboratoryResults' && <LabResults displayInfo={displayInfo} />}
            {displayLabel === 'immunizations' && <Immunizations displayInfo={displayInfo} />}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
    backgroundColor: '#f5f5f5',
  },
  headerSurface: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#2196F3',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  patientCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  patientHeaderInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    color: '#333',
    marginBottom: 4,
  },
  patientMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientMeta: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
  },
  patientId: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#888',
  },
  divider: {
    marginVertical: 12,
  },
  patientDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  patientDetailItem: {
    width: '50%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    color: '#777',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 1,
  },
  categoryTitle: {
    fontFamily: sd.fonts.bold,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  contentCard: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 1,
    minHeight: 200,
  },
});

export default MedicalRecord;