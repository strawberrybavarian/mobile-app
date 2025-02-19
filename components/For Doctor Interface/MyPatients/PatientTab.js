import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useTheme, Avatar, Card, Searchbar } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { MyPatientStyles } from './MyPatientsStyles';
import { ip } from '../../../ContentExport';

const PatientTab = ({ patients, viewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const theme = useTheme();
  const styles = MyPatientStyles(theme);

  useEffect(() => {
    console.log('Patients:', patients);
  }, [patients]);

  useEffect(() => {
    setFilteredPatients(
      patients.filter((patient) => {
        const fullName = `${patient.patient_firstName} ${patient.patient_lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
    );
  }, [searchQuery, patients]);

  const handleViewDetails = useCallback((patient) => {
    viewDetails(patient);
  }, [viewDetails]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Patients</Text>

      <View style={{ paddingHorizontal: 20 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ paddingVertical: -2 }} 
        /> 
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.bodyContainer}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Card
                key={patient._id}
                mode="elevated"
                onPress={() => handleViewDetails(patient)}
                style={{
                  backgroundColor: theme.colors.surface,
                  elevation: 1,
                }}
              >
                <Card.Title
                  title={`${patient.patient_firstName} ${patient.patient_middleInitial ? `${patient.patient_middleInitial}. ` : ''}${patient.patient_lastName}`}
                  titleStyle={styles.patientName}
                  left={() => (
                    <Avatar.Image
                      size={40}
                      source={{ uri: `${ip.address}/${patient.patient_image}` }}
                    />
                  )}
                  right={() => (
                    <Entypo
                      name="chevron-thin-right"
                      size={20}
                      color={theme.colors.onSurface}
                      style={{ marginRight: 15 }}
                    />
                  )}
                />
              </Card>
            ))
          ) : (
            <Text style={styles.noPatientsText}>You have no patients yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(PatientTab);
