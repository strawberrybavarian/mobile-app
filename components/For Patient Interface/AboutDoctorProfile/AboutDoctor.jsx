import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Divider, Button, Avatar, useTheme, ActivityIndicator, Chip, Modal, Portal, IconButton } from 'react-native-paper';
import { Entypo, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { DoctorNotificationStyle } from '../../For Doctor Interface/DoctorStyleSheet/DoctorCSS';
import sd from '../../../utils/styleDictionary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../../UserContext';


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
  const [hmoDetails, setHmoDetails] = useState({});
  const { token } = useUser();
  
  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsModalVisible, setAnnouncementsModalVisible] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  // Function to fetch doctor's announcements
  const fetchDoctorAnnouncements = async (doctorId) => {
    if (!doctorId) return;
    
    try {
      setLoadingAnnouncements(true);
      const response = await axios.get(`${ip.address}/api/doctor/${doctorId}/announcements`);
      
      if (response.data && Array.isArray(response.data.announcements)) {
        setAnnouncements(response.data.announcements);
      } else {
        // Default test announcements if API doesn't exist or returns empty
        setAnnouncements([
          {
            _id: '1',
            title: 'Clinic Hours Update',
            content: 'Starting next week, I will be extending my afternoon hours on Tuesdays and Thursdays until 6:00 PM to accommodate more patients.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            important: true
          },
          {
            _id: '2',
            title: 'New Services Available',
            content: 'I am now offering telemedicine consultations for follow-up appointments. Please call the clinic to schedule.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            important: false
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching doctor announcements:', err);
      // Set default announcements for demo if API fails
      setAnnouncements([
        {
          _id: '1',
          title: 'Clinic Hours Update',
          content: 'Starting next week, I will be extending my afternoon hours on Tuesdays and Thursdays until 6:00 PM to accommodate more patients.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          important: true
        }
      ]);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchHmoDetails = async (hmoIds) => {
    if (!hmoIds || !Array.isArray(hmoIds) || hmoIds.length === 0) return;
    
    try {
      const hmoDetailsMap = {};
      
      const hmoPromises = hmoIds.map(async (hmo) => {
        if (typeof hmo === 'string') {
          try {
            const response = await axios.get(`${ip.address}/api/admin/hmo/${hmo}`);
            if (response.data) {
              hmoDetailsMap[hmo] = response.data;
            }
          } catch (err) {
            console.log(`Error fetching HMO details for ID ${hmo}:`, err);
          }
        } else if (hmo && hmo.name) {
          hmoDetailsMap[hmo._id || ''] = hmo;
        }
      });
      
      await Promise.all(hmoPromises);
      
      console.log("Fetched HMO details:", hmoDetailsMap);
      setHmoDetails(hmoDetailsMap);
    } catch (error) {
      console.error('Error fetching HMO details:', error);
    }
  };

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
        
        const response = await axios.get(`${ip.address}/api/doctor/one/${item._id}`);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        console.log('Doctor data received:', JSON.stringify(response.data, null, 2));
        
        setDoctorData(response.data.doctor);
        
        if (response.data.doctor?.dr_image) {
          const imageUrl = response.data.doctor.dr_image.startsWith('http') 
            ? response.data.doctor.dr_image 
            : `${ip.address}/${response.data.doctor.dr_image.replace(/^\//, '')}`;
            
          console.log(`Setting doctor image URL: ${imageUrl}`);
          setImageUri(imageUrl);
        }
        
        if (response.data.doctor?.dr_hmo && Array.isArray(response.data.doctor.dr_hmo)) {
          fetchHmoDetails(response.data.doctor.dr_hmo);
        }
        
        // Fetch doctor announcements
        fetchDoctorAnnouncements(item._id);
        
        const doctorInfo = response.data.doctor;
        setSectionsLoaded({
          contact: !!(doctorInfo?.dr_email || doctorInfo?.dr_contactNumber),
          biography: !!(doctorInfo?.biography && 
            (doctorInfo.biography?.medicalSchool?.institution || 
             doctorInfo.biography?.residency?.institution || 
             doctorInfo.biography?.fellowship?.institution)),
          certifications: !!(doctorInfo?.biography && 
            (doctorInfo.biography?.localSpecialtyBoard?.certification || 
             doctorInfo.biography?.localSubSpecialtyBoard?.certification)),
          schedule: !!doctorInfo?.availability,
          services: !!(doctorInfo?.dr_services && doctorInfo.dr_services.length > 0)
        });
      } catch (err) {
        console.error('Error fetching doctor details:', err.message);
        setError(`Failed to load doctor information: ${err.message}`);
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

  // Function to format date
  const formatAnnouncementDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Render announcements modal
  const renderAnnouncementsModal = () => {
    return (
      <Portal>
        <Modal 
          visible={announcementsModalVisible} 
          onDismiss={() => setAnnouncementsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <MaterialIcons name="campaign" size={24} color={theme.colors.primary} />
              <Text style={styles.modalTitle}>Doctor Announcements</Text>
              <IconButton
                icon="close"
                size={20}
                onPress={() => setAnnouncementsModalVisible(false)}
              />
            </View>
            
            <Divider />
            
            {/* Announcements List */}
            <ScrollView style={styles.announcementsList}>
              {loadingAnnouncements ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.announcementLoader} />
              ) : announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <Card key={announcement._id} style={[
                    styles.announcementCard,
                    announcement.important && styles.importantAnnouncementCard
                  ]}>
                    <Card.Content>
                      <View style={styles.announcementHeader}>
                        <Text style={styles.announcementDate}>
                          {formatAnnouncementDate(announcement.createdAt)}
                        </Text>
                        {announcement.important && (
                          <Chip 
                            mode="outlined" 
                            style={styles.importantChip}
                            textStyle={styles.importantChipText}
                          >
                            Important
                          </Chip>
                        )}
                      </View>
                      <Text style={styles.announcementTitle}>{announcement.title}</Text>
                      <Text style={styles.announcementContent}>{announcement.content}</Text>
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <View style={styles.noAnnouncementsContainer}>
                  <MaterialIcons name="campaign" size={48} color="#BDBDBD" />
                  <Text style={styles.noAnnouncementsText}>No announcements from this doctor</Text>
                </View>
              )}
            </ScrollView>
            
            <Divider />
            
            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Button
                mode="contained"
                onPress={() => setAnnouncementsModalVisible(false)}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    );
  };

  // Render additional information about the doctor
  const renderAdditionalInfo = () => {
    if (!doctorData) return null;
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="About" 
          titleStyle={styles.sectionTitle}
          left={(props) => <MaterialIcons {...props} name="info" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          <Text style={styles.infoText}>
            {doctorData.dr_biography || 'No additional information available about this doctor.'}
          </Text>
          
          {doctorData.dr_experience ? (
            <View style={[styles.infoRow, {marginTop: 12}]}>
              <Text style={styles.infoLabel}>Experience:</Text>
              <Text style={styles.infoText}>
                {doctorData.dr_experience} {doctorData.dr_experience === 1 ? 'year' : 'years'}
              </Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>
    );
  };
  
  // Render biography details
  const renderBiography = () => {
    if (!doctorData?.biography || !sectionsLoaded.biography) return null;
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Education & Training" 
          titleStyle={styles.sectionTitle}
          left={(props) => <FontAwesome5 {...props} name="graduation-cap" size={20} color={theme.colors.primary} />}
        />
        <Card.Content>
          {doctorData.biography?.medicalSchool?.institution ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medical School:</Text>
              <Text style={styles.infoText}>
                {doctorData.biography.medicalSchool.institution}
                {doctorData.biography.medicalSchool.yearGraduated ? 
                  ` (${doctorData.biography.medicalSchool.yearGraduated})` : ''}
              </Text>
            </View>
          ) : null}
          
          {doctorData.biography?.residency?.institution ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Residency:</Text>
              <Text style={styles.infoText}>
                {doctorData.biography.residency.institution}
                {doctorData.biography.residency.yearCompleted ? 
                  ` (${doctorData.biography.residency.yearCompleted})` : ''}
              </Text>
            </View>
          ) : null}
          
          {doctorData.biography?.fellowship?.institution ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fellowship:</Text>
              <Text style={styles.infoText}>
                {doctorData.biography.fellowship.institution}
                {doctorData.biography.fellowship.yearCompleted ? 
                  ` (${doctorData.biography.fellowship.yearCompleted})` : ''}
              </Text>
            </View>
          ) : null}
        </Card.Content>
      </Card>
    );
  };
  
  // Render certifications
  const renderCertifications = () => {
    if (!doctorData?.biography || !sectionsLoaded.certifications) return null;
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Certifications" 
          titleStyle={styles.sectionTitle}
          left={(props) => <MaterialCommunityIcons {...props} name="certificate" size={24} color={theme.colors.primary} />}
        />
        <Card.Content>
          {doctorData.biography?.localSpecialtyBoard?.certification ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Specialty Board:</Text>
              <Text style={styles.infoText}>
                {doctorData.biography.localSpecialtyBoard.certification}
                {doctorData.biography.localSpecialtyBoard.year ? 
                  ` (${doctorData.biography.localSpecialtyBoard.year})` : ''}
              </Text>
            </View>
          ) : null}
          
          {doctorData.biography?.localSpecialtyBoard?.issuingOrganization ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Issuing Organization:</Text>
              <Text style={styles.infoText}>
                {doctorData.biography.localSpecialtyBoard.issuingOrganization}
              </Text>
            </View>
          ) : null}
          
          {doctorData.biography?.localSubSpecialtyBoard?.certification ? (
            <>
              <Divider style={{marginVertical: 12}} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Subspecialty:</Text>
                <Text style={styles.infoText}>
                  {doctorData.biography.localSubSpecialtyBoard.certification}
                  {doctorData.biography.localSubSpecialtyBoard.year ? 
                    ` (${doctorData.biography.localSubSpecialtyBoard.year})` : ''}
                </Text>
              </View>
              
              {doctorData.biography?.localSubSpecialtyBoard?.issuingOrganization ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Issuing Organization:</Text>
                  <Text style={styles.infoText}>
                    {doctorData.biography.localSubSpecialtyBoard.issuingOrganization}
                  </Text>
                </View>
              ) : null}
            </>
          ) : null}
        </Card.Content>
      </Card>
    );
  };
  
  // Render HMOs
  const renderHMOs = () => {
    if (!doctorData?.dr_hmo || !Array.isArray(doctorData.dr_hmo) || doctorData.dr_hmo.length === 0) {
      return null;
    }
    
    return (
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Accepted HMOs" 
          titleStyle={styles.sectionTitle}
          left={(props) => <MaterialIcons {...props} name="local-hospital" size={24} color={theme.colors.primary} />}
        />
        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {doctorData.dr_hmo.map((hmoId, index) => {
            const hmo = hmoDetails[hmoId] || {};
            // Extract the name or a default string value
            const hmoName = typeof hmo.name === 'string' ? hmo.name : 'Unknown HMO';
            
            return (
              <Chip 
                key={hmoId || index} 
                style={styles.serviceChip}
                textStyle={{fontFamily: sd.fonts.medium}}
              >
                {hmoName}
              </Chip>
            );
          })}
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={backButton}>
            <Entypo name="chevron-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: sd.fonts.semiBold, marginLeft: 16 }}>
            Doctor Details
          </Text>
        </View>
        
        {/* Loading or Error */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading doctor details...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
            </Card.Content>
          </Card>
        ) : (
          <>
            {/* Doctor Profile Card with Announcements Button */}
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <Avatar.Image size={80} source={{ uri: imageUri }} />
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{(doctorData?.dr_firstName+ " " + doctorData?.dr_lastName) || 'Unknown Doctor'}</Text>
                  <Text style={styles.doctorSpecialty}>{doctorData?.dr_specialty || 'Specialty not available'}</Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusIndicator,
                        { backgroundColor: doctorData?.dr_status === 'active' ? '#4CAF50' : '#F44336' }
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {doctorData?.dr_status === 'active' ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </Card.Content>
              
              {announcements.length > 0 && (
                <Card.Actions style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.announcementsButton}
                    onPress={() => setAnnouncementsModalVisible(true)}
                  >
                    
                    <View style={styles.announcementsButtonContent}>
                      <Text style={styles.announcementsButtonText}>Doctor Announcements</Text>
                    </View>
                  </TouchableOpacity>
                </Card.Actions>
              )}
            </Card>
            
            {/* Additional Info */}
            {renderAdditionalInfo()}
            
            {/* Biography */}
            {renderBiography()}
            
            {/* Certifications */}
            {renderCertifications()}
            
            {/* HMOs */}
            {renderHMOs()}
            
            {/* Services */}
            {sectionsLoaded.services && (
              <Card style={styles.sectionCard}>
                <Card.Title 
                  title="Services Offered" 
                  titleStyle={styles.sectionTitle}
                  left={(props) => <MaterialIcons {...props} name="medical-services" size={24} color={theme.colors.primary} />}
                />
                <Card.Content style={styles.servicesContainer}>
                  {doctorData.dr_services && doctorData.dr_services.map((service, index) => {
                    // Handle both string and object formats for services
                    const serviceName = typeof service === 'string' 
                      ? service 
                      : typeof service === 'object' && service !== null 
                        ? (service.name || 'Unnamed Service') 
                        : 'Unknown Service';
                        
                    return (
                      <Chip 
                        key={`service-${index}`}
                        style={styles.serviceChip}
                        textStyle={{fontFamily: sd.fonts.medium}}
                      >
                        {serviceName}
                      </Chip>
                    );
                  })}
                  {(!doctorData.dr_services || doctorData.dr_services.length === 0) && (
                    <Text style={styles.noDataText}>No services listed</Text>
                  )}
                </Card.Content>
              </Card>
            )}

            
          </>
        )}
      </ScrollView>
      
      {/* Book Appointment Button */}
      <View style={[styles.buttonContainer, { paddingBottom: 20 }]}>
        <Button
          mode="contained"
          style={styles.bookButton}
          labelStyle={styles.buttonText}
          onPress={bookAppointment}
        >
          Book Appointment
        </Button>
      </View>
      
      {/* Render the announcements modal */}
      {renderAnnouncementsModal()}
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
  
  // Add new styles for announcements
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  announcementsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    position: 'relative',
  },
  announcementsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  announcementsIcon: {
    marginRight: 8,
  },
  announcementsButtonText: {
    fontFamily: sd.fonts.medium,
    fontSize: 14,
    color: '#2196F3',
  },
  announcementsBadge: {
    position: 'absolute',
    backgroundColor: '#F44336',
    borderRadius: 10,
    height: 20,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    top: -6,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  announcementsBadgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: sd.fonts.bold,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    //maxHeight: '80%',
  },
  modalContent: {
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  announcementsList: {
    maxHeight: 400,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  announcementCard: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  importantAnnouncementCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#757575',
  },
  importantChip: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  importantChipText: {
    color: '#D32F2F',
    fontSize: 10,
    fontFamily: sd.fonts.medium,
  },
  announcementTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    color: '#333',
    marginBottom: 8,
  },
  announcementContent: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#555',
    lineHeight: 20,
  },
  announcementLoader: {
    marginVertical: 40,
  },
  noAnnouncementsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noAnnouncementsText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#757575',
    textAlign: 'center',
  },
  modalFooter: {
    padding: 16,
    alignItems: 'center',
  },
  
  // The rest of the existing styles
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
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  bookButton: {
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: sd.fonts.semiBold,
    fontSize: 16,
    paddingVertical: 4,
  },
  // Add these to your styles object
  postContainer: {
    marginBottom: 12,
  },
  postContent: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#333',
    marginBottom: 4,
  },
  postDate: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#757575',
    fontStyle: 'italic',
  },
});

export default AboutDoctor;