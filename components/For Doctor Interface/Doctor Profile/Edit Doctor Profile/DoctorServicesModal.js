import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Button, useTheme, Searchbar, Divider } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ip } from '@/ContentExport';
import sd from '@/utils/styleDictionary';

const DoctorServicesModal = ({ visible, onClose, userId, services, onSave }) => {
  const theme = useTheme();
  const [availableServices, setAvailableServices] = useState([]);
  const [doctorServices, setDoctorServices] = useState(services || []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (visible) {
      fetchServices();
    }
  }, [visible]);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip.address}/api/admin/getall/services`);
      setAvailableServices(response.data || []);
      setDoctorServices(services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const isServiceSelected = (serviceId) => {
    return doctorServices.some(id => id === serviceId);
  };
  
  const toggleService = (serviceId) => {
    setDoctorServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  
  const handleSave = () => {
    setSaving(true);
    // Save logic
    setTimeout(() => {
      onSave(doctorServices);
      setSaving(false);
      onClose();
    }, 500);
  };
  
  const filteredServices = availableServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getServiceName = (serviceId) => {
    const service = availableServices.find(s => s._id === serviceId);
    return service ? service.name : 'Unknown Service';
  };
  
  const renderServiceItem = ({ item }) => {
    const isSelected = isServiceSelected(item._id);
    
    return (
      <TouchableOpacity 
        style={[styles.serviceItem, isSelected && styles.serviceItemSelected]} 
        onPress={() => toggleService(item._id)}
      >
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
        </View>
        <Button
          mode={isSelected ? "contained" : "outlined"}
          onPress={() => toggleService(item._id)}
          style={isSelected ? styles.removeButton : styles.addButton}
          labelStyle={styles.buttonLabel}
        >
          {isSelected ? "Remove" : "Add"}
        </Button>
      </TouchableOpacity>
    );
  };
  
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropTransitionOutTiming={0}
      style={styles.modal}
      avoidKeyboard
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Services</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Entypo name="cross" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.description}>
            Select the medical services that you offer to patients:
          </Text>
          
          <Searchbar
            placeholder="Search services"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchBarInput}
          />
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading services...</Text>
            </View>
          ) : (
            <>
              {doctorServices.length > 0 ? (
                <View style={styles.selectedSection}>
                  <Text style={styles.sectionTitle}>Your Services ({doctorServices.length})</Text>
                  <View style={styles.chipContainer}>
                    {doctorServices.map(serviceId => (
                      <TouchableOpacity 
                        key={serviceId} 
                        style={styles.chip}
                        onPress={() => toggleService(serviceId)}
                      >
                        <Text style={styles.chipText}>{getServiceName(serviceId)}</Text>
                        <Entypo name="cross" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={styles.noServicesText}>
                  You haven't added any services yet.
                </Text>
              )}
              
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Available Services</Text>
              {filteredServices.length > 0 ? (
                <FlatList
                  data={filteredServices}
                  renderItem={renderServiceItem}
                  keyExtractor={item => item._id}
                  style={styles.list}
                />
              ) : (
                <Text style={styles.emptyText}>
                  {searchQuery ? "No services matching your search" : "No services available"}
                </Text>
              )}
            </>
          )}
        </View>
        
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={onClose}
            style={styles.cancelButton}
            labelStyle={styles.footerButtonLabel}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
            labelStyle={styles.footerButtonLabel}
            disabled={saving}
            loading={saving}
          >
            Save Services
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
    maxHeight: 500,
  },
  description: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    elevation: 0,
    borderRadius: 8,
  },
  searchBarInput: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#2196F3',
    marginBottom: 8,
    marginTop: 8,
  },
  selectedSection: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4f8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#2196F3',
    marginRight: 4,
  },
  divider: {
    marginVertical: 16,
  },
  list: {
    maxHeight: 350,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  serviceItemSelected: {
    backgroundColor: '#f8f8f8',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: '#333',
  },
  addButton: {
    borderColor: '#2196F3',
  },
  removeButton: {
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.medium,
  },
  loaderContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: sd.fonts.italic,
    color: '#999',
    textAlign: 'center',
    padding: 16,
  },
  noServicesText: {
    fontSize: 14,
    fontFamily: sd.fonts.italic,
    color: '#999',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2196F3',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  footerButtonLabel: {
    fontFamily: sd.fonts.medium,
  }
});

export default DoctorServicesModal;