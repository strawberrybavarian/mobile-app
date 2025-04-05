import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Checkbox, Button, useTheme, Divider, Searchbar } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { ip } from '@/ContentExport';
import sd from '@/utils/styleDictionary';

const DoctorHMOsModal = ({ visible, onClose, userId, selectedHmos, onSave }) => {
  const theme = useTheme();
  const [availableHmos, setAvailableHmos] = useState([]);
  const [doctorHmos, setDoctorHmos] = useState(selectedHmos || []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (visible) {
      fetchHMOs();
    }
  }, [visible]);
  
  const fetchHMOs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ip.address}/api/admin/getall/hmo`);
      setAvailableHmos(response.data || []);
      setDoctorHmos(selectedHmos || []);
    } catch (error) {
      console.error('Error fetching HMOs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleHmoSelection = (hmoId) => {
    setDoctorHmos(prevSelected => {
      if (prevSelected.includes(hmoId)) {
        return prevSelected.filter(id => id !== hmoId);
      } else {
        return [...prevSelected, hmoId];
      }
    });
  };
  
  const handleSave = () => {
    setSaving(true);
    // Save logic
    setTimeout(() => {
      onSave(doctorHmos);
      setSaving(false);
      onClose();
    }, 500);
  };
  
  const filteredHMOs = availableHmos.filter(hmo => 
    hmo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHMOName = (hmoId) => {
    const hmo = availableHmos.find(h => h._id === hmoId);
    return hmo ? hmo.name : 'Unknown HMO';
  };
  
  const renderHmoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.hmoItem} 
      onPress={() => handleHmoSelection(item._id)}
    >
      <Checkbox
        status={doctorHmos.includes(item._id) ? 'checked' : 'unchecked'}
        onPress={() => handleHmoSelection(item._id)}
        color={theme.colors.primary}
      />
      <Text style={styles.hmoName}>{item.name}</Text>
    </TouchableOpacity>
  );
  
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
          <Text style={styles.title}>Manage HMOs</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Entypo name="cross" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.description}>
            Select the Health Maintenance Organizations (HMOs) that you accept:
          </Text>
          
          <Searchbar
            placeholder="Search HMOs"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchBarInput}
          />
          
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading HMOs...</Text>
            </View>
          ) : (
            <>
              {doctorHmos.length > 0 ? (
                <View style={styles.selectedSection}>
                  <Text style={styles.sectionTitle}>Selected HMOs</Text>
                  <View style={styles.chipContainer}>
                    {doctorHmos.map(hmoId => (
                      <TouchableOpacity 
                        key={hmoId} 
                        style={styles.chip}
                        onPress={() => handleHmoSelection(hmoId)}
                      >
                        <Text style={styles.chipText}>{getHMOName(hmoId)}</Text>
                        <Entypo name="cross" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : null}
              
              <Text style={styles.sectionTitle}>Available HMOs</Text>
              {filteredHMOs.length > 0 ? (
                <FlatList
                  data={filteredHMOs}
                  renderItem={renderHmoItem}
                  keyExtractor={item => item._id}
                  style={styles.list}
                />
              ) : (
                <Text style={styles.emptyText}>
                  {searchQuery ? "No HMOs matching your search" : "No HMOs available"}
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
            labelStyle={styles.buttonLabel}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
            labelStyle={styles.buttonLabel}
            disabled={saving}
            loading={saving}
          >
            Save HMOs
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
  list: {
    maxHeight: 350,
  },
  hmoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hmoName: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
    color: '#333',
    marginLeft: 8,
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
  buttonLabel: {
    fontFamily: sd.fonts.medium,
  }
});

export default DoctorHMOsModal;