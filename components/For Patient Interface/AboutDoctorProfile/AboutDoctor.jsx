import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Divider, Button, Avatar, useTheme, ActivityIndicator, Chip } from 'react-native-paper';
import { Entypo, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { DoctorNotificationStyle } from '../../For Doctor Interface/DoctorStyleSheet/DoctorCSS';
import sd from '../../../utils/styleDictionary';
import { SafeAreaView } from 'react-native-safe-area-context';


const AboutDoctor = ({ navigation, route }) => {
  const theme = useTheme();
  const { item } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);
  const [sectionsLoaded, setSectionsLoaded] = useState({
    contact: false,
    biography: false,
    certifications: false,
    schedule: false,
    services: false
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!item || !item._id) {
        setError('Missing doctor information');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching doctor details for ID: ${item._id}`);
        
        const response = await axios.get(`${ip.address}/api/doctors/${item._id}`);
        console.log('Doctor data received:', JSON.stringify(response.data).substring(0, 100) + '...');
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        setDoctorData(response.data);
        
        // Handle image URL with fallback
        if (response.data.dr_image) {
          const imageUrl = `${ip.address}/${response.data.dr_image}`;
          console.log(`Setting doctor image: ${imageUrl}`);
          setImageUri(imageUrl);
        }
        
        // Check sections
        const doctorInfo = response.data;
        setSectionsLoaded({
          contact: !!(doctorInfo.dr_email || doctorInfo.dr_contactNumber),
          biography: !!(doctorInfo.biography && (doctorInfo.biography.medicalSchool || doctorInfo.biography.residency)),
          certifications: !!(doctorInfo.biography && (doctorInfo.biography.localSpecialtyBoard || doctorInfo.biography.localSubSpecialtyBoard)),
          schedule: !!doctorInfo.availability,
          services: !!(doctorInfo.dr_services && doctorInfo.dr_services.length > 0)
        });
      } catch (err) {
        console.error('Error fetching doctor details:', err.message);
        setError(`Failed to load doctor information: ${err.message}`);
        // Fallback to item data
        setDoctorData(item);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [item]);

  const backButton = () => {
    navigation.goBack();
  };

  const bookAppointment = () => {
    navigation.navigate('bookappointment', { item: doctorData || item });
  };

  const renderBiography = () => {
    if (!doctorData?.biography) return null;
    
    const { biography } = doctorData;
    const hasInfo = biography.medicalSchool?.institution || 
                    biography.residency?.institution || 
                    biography.fellowship?.institution;
    
    if (!hasInfo) return null;

    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Education & Training" 
          titleStyle={styles.sectionTitle}
          left={(props) => <MaterialIcons {...props} name="school" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          {biography.medicalSchool?.institution && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medical School:</Text>
              <Text style={styles.infoText}>
                {biography.medicalSchool.institution}
                {biography.medicalSchool.yearGraduated && 
                  ` (${biography.medicalSchool.yearGraduated})`}
              </Text>
            </View>
          )}
          
          {biography.residency?.institution && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Residency:</Text>
              <Text style={styles.infoText}>
                {biography.residency.institution}
                {biography.residency.yearCompleted && 
                  ` (${biography.residency.yearCompleted})`}
              </Text>
            </View>
          )}
          
          {biography.fellowship?.institution && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fellowship:</Text>
              <Text style={styles.infoText}>
                {biography.fellowship.institution}
                {biography.fellowship.yearCompleted && 
                  ` (${biography.fellowship.yearCompleted})`}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderCertifications = () => {
    if (!doctorData?.biography) return null;
    
    const { biography } = doctorData;
    const hasInfo = biography.localSpecialtyBoard?.certification || 
                    biography.localSubSpecialtyBoard?.certification;
    
    if (!hasInfo) return null;

    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Board Certifications" 
          titleStyle={styles.sectionTitle}
          left={(props) => <MaterialIcons {...props} name="verified" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          {biography.localSpecialtyBoard?.certification && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Specialty Board:</Text>
              <Text style={styles.infoText}>
                {biography.localSpecialtyBoard.certification}
                {biography.localSpecialtyBoard.year && 
                  ` (${biography.localSpecialtyBoard.year})`}
              </Text>
            </View>
          )}
          
          {biography.localSubSpecialtyBoard?.certification && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Subspecialty:</Text>
              <Text style={styles.infoText}>
                {biography.localSubSpecialtyBoard.certification}
                {biography.localSubSpecialtyBoard.year && 
                  ` (${biography.localSubSpecialtyBoard.year})`}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderSchedule = () => {
    if (!doctorData?.availability) return null;
    
    // Check if there's any availability data worth showing
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hasAvailability = days.some(day => {
      const daySchedule = doctorData.availability[day];
      return (daySchedule?.morning?.available || daySchedule?.afternoon?.available);
    });
    
    if (!hasAvailability) return null;
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Schedule & Availability" 
          titleStyle={styles.sectionTitle}
          left={(props) => <MaterialIcons {...props} name="schedule" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          {days.map(day => {
            const daySchedule = doctorData.availability[day];
            if (!daySchedule) return null;
            
            const morningAvailable = daySchedule.morning?.available;
            const afternoonAvailable = daySchedule.afternoon?.available;
            
            if (!morningAvailable && !afternoonAvailable) {
              return null;
            }
            
            return (
              <View key={day} style={styles.scheduleRow}>
                <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <View style={styles.timeChips}>
                  {morningAvailable && daySchedule.morning?.startTime && daySchedule.morning?.endTime && (
                    <Chip 
                      style={[styles.timeChip, {backgroundColor: theme.colors.primaryContainer}]}
                      textStyle={{color: theme.colors.primary, fontFamily: sd.fonts.medium}}
                    >
                      {daySchedule.morning.startTime} - {daySchedule.morning.endTime}
                    </Chip>
                  )}
                  {afternoonAvailable && daySchedule.afternoon?.startTime && daySchedule.afternoon?.endTime && (
                    <Chip 
                      style={[styles.timeChip, {backgroundColor: theme.colors.primaryContainer}]}
                      textStyle={{color: theme.colors.primary, fontFamily: sd.fonts.medium}}
                    >
                      {daySchedule.afternoon.startTime} - {daySchedule.afternoon.endTime}
                    </Chip>
                  )}
                </View>
              </View>
            );
          })}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading doctor information...</Text>
      </View>
    );
  }

  // Fallback info 
  const firstName = doctorData?.dr_firstName || item?.dr_firstName || '';
  const lastName = doctorData?.dr_lastName || item?.dr_lastName || '';
  const specialty = doctorData?.dr_specialty || item?.dr_specialty || 'General Practitioner';
  const status = doctorData?.activityStatus || 'Offline';

  const profileImage = imageUri ? 
    { uri: imageUri } : 
    require('../../../assets/pictures/Doc.png');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={DoctorNotificationStyle.arrowButton}
            onPress={backButton}>
            <Entypo name="chevron-thin-left" size={14} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', width: "83%" }}>
            <Text style={DoctorNotificationStyle.title}>Doctor Profile</Text>
          </View>
        </View>

        {error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Doctor Profile Header */}
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <Avatar.Image 
                  size={100} 
                  source={profileImage} 
                />
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>
                    Dr. {firstName} {lastName}
                  </Text>
                  <Text style={styles.doctorSpecialty}>{specialty}</Text>
                  
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusIndicator, 
                      {backgroundColor: status === 'Online' ? '#4CAF50' : '#757575'}
                    ]} />
                    <Text style={styles.statusText}>
                      {status}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Contact Information */}
            <Card style={styles.sectionCard}>
              <Card.Title 
                title="Contact Information" 
                titleStyle={styles.sectionTitle}
                left={(props) => <MaterialIcons {...props} name="contact-phone" size={24} color={theme.colors.primary} />}
              />
              <Card.Content>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoText}>{doctorData?.dr_email || 'Not provided'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoText}>{doctorData?.dr_contactNumber || 'Not provided'}</Text>
                </View>
              </Card.Content>
            </Card>

            {/* Education & Training */}
            {renderBiography()}

            {/* Board Certifications */}
            {renderCertifications()}

            {/* Schedule */}
            {renderSchedule()}

            {/* Services Offered */}
            <Card style={[styles.sectionCard, {marginBottom: 100}]}>
              <Card.Title 
                title="Services Offered" 
                titleStyle={styles.sectionTitle}
                left={(props) => <MaterialIcons {...props} name="medical-services" size={24} color={theme.colors.primary} />}
              />
              <Card.Content style={styles.servicesContainer}>
                {doctorData?.dr_services && Array.isArray(doctorData.dr_services) && doctorData.dr_services.length > 0 ? (
                  doctorData.dr_services.map((service, index) => (
                    <Chip 
                      key={index} 
                      style={styles.serviceChip}
                      textStyle={{fontFamily: sd.fonts.medium}}
                    >
                      {service.name || service || 'Service'}
                    </Chip>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No services listed</Text>
                )}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
      
      {/* Footer Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.bookButton}
          labelStyle={styles.buttonText}
          onPress={bookAppointment}
        >
          Book Appointment
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#555',
  },
  errorCard: {
    margin: 16,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
    fontFamily: sd.fonts.medium,
    textAlign: 'center',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorDetails: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontFamily: sd.fonts.bold,
    color: '#333',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#757575',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 18,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: '35%',
    fontSize: 15,
    fontFamily: sd.fonts.semiBold,
    color: '#555',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    fontFamily: sd.fonts.regular,
    color: '#333',
  },
  scheduleRow: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  dayText: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
    marginBottom: 6,
  },
  timeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceChip: {
    margin: 4,
  },
  noDataText: {
    fontFamily: sd.fonts.regular,
    color: '#757575',
    fontStyle: 'italic',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 16,
    paddingVertical: 4,
  }
});

export default AboutDoctor;