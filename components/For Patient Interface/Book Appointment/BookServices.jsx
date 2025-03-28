import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Card, TextInput, Dialog, Paragraph, Portal } from 'react-native-paper';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useTheme } from 'react-native-paper';
import { getData } from '../../storageUtility';
import { useUser } from '../../../UserContext';
import sd from '../../../utils/styleDictionary';

const BookServices = ({ navigation, route }) => {
  const { serviceData } = route.params || {};
  const theme = useTheme();
  const { user } = useUser();
  
  const [service, setService] = useState(serviceData || null);
  const [date, setDate] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  // Fetch service details if not provided
  useEffect(() => {
    if (serviceData?._id && !service) {
      setLoading(true);
      axios.get(`${ip.address}/api/admin/services/${serviceData._id}`)
        .then(response => {
          setService(response.data);
        })
        .catch(error => {
          console.error('Error fetching service details:', error);
          setError('Failed to load service details');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [serviceData]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const validateForm = () => {
    if (!date) {
      setError('Please select a date for your appointment');
      return false;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for your appointment');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      showDialog();
    }
  };

  const confirmAppointment = async () => {
    try {
      setLoading(true);
      
      // Get stored token directly
      const storedToken = await getData("authToken");
      const userRole = await getData("userRole");
      
      if (!storedToken) {
        Alert.alert("Session Expired", "Please sign in again.");
        navigation.navigate("SigninPage");
        return;
      }
      
      const formData = {
        serviceId: service._id,
        patient: user._id,
        date: date.toISOString().split('T')[0],
        reason: reason,
        appointment_type: {
          appointment_type: service.name,
          category: service.category || 'Service'
        },
        _role: userRole
      };
      
      const response = await axios.post(
        `${ip.address}/api/patient/api/${user._id}/createserviceappointment`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          }
        }
      );
      
      // Hide dialog and show success
      hideDialog();
      
      Alert.alert(
        "Success",
        "Appointment created successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
      
    } catch (err) {
      console.error("Appointment creation error:", err);
      
      let errorMessage = "Could not create appointment. Please try again later.";
      
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        
        if (err.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please sign in again.",
            [{ text: "OK", onPress: () => navigation.navigate("SigninPage") }]
          );
          return;
        }
      }
      
      hideDialog();
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContainer: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontFamily: sd.fonts.bold,
      color: theme.colors.primary,
      textAlign: 'center',
      flex: 2,
    },
    serviceCard: {
      marginBottom: 20,
      borderRadius: 10,
    },
    cardContent: {
      padding: 16,
    },
    serviceName: {
      fontSize: 18,
      fontFamily: sd.fonts.semiBold,
      marginBottom: 8,
    },
    serviceDescription: {
      marginBottom: 8,
      fontFamily: sd.fonts.regular,
    },
    serviceDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    detailLabel: {
      fontFamily: sd.fonts.medium,
      width: 100,
    },
    detailValue: {
      fontFamily: sd.fonts.regular,
      flex: 1,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: sd.fonts.medium,
      marginTop: 16,
      marginBottom: 8,
      color: theme.colors.primary,
    },
    dateButton: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    dateButtonText: {
      fontFamily: sd.fonts.regular,
      color: theme.colors.text,
    },
    textArea: {
      minHeight: 100,
      marginBottom: 20,
    },
    errorText: {
      color: 'red',
      marginBottom: 16,
      fontFamily: sd.fonts.regular,
    },
    submitButton: {
      marginVertical: 20,
      marginBottom: 100,
    },
    note: {
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 8,
      marginBottom: 16,
      fontFamily: sd.fonts.light,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1 }}>
            <Entypo name="chevron-small-left" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Book Service</Text>
          <View style={{ flex: 1 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : error && !service ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : service ? (
          <>
            {/* Service details card */}
            <Card style={styles.serviceCard} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.serviceDetail}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{service.category || 'General Service'}</Text>
                </View>
                
                <View style={styles.serviceDetail}>
                  <Text style={styles.detailLabel}>Availability:</Text>
                  <Text style={styles.detailValue}>{service.availability || 'Available'}</Text>
                </View>
              </Card.Content>
            </Card>

            {/* Date selection */}
            <Text style={styles.subtitle}>Select Date</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {date ? formatDate(date) : 'Choose a date'}
              </Text>
              <Entypo name="calendar" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Primary concern */}
            <Text style={styles.subtitle}>Primary Concern</Text>
            <TextInput
              mode="outlined"
              multiline
              value={reason}
              onChangeText={setReason}
              style={styles.textArea}
            />

            <Text style={styles.note}>
              *The time and date may change depending on service availability, 
              so please always chat with our staff to confirm.
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Submit button */}
            <Button
              mode="contained"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
            >
              Submit
            </Button>
          </>
        ) : (
          <Text>No service information available</Text>
        )}
      </KeyboardAwareScrollView>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirm Appointment</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Service: {service?.name}</Paragraph>
            <Paragraph>Category: {service?.category || 'General Service'}</Paragraph>
            <Paragraph>Date: {date?.toLocaleDateString()}</Paragraph>
            <Paragraph>Primary Concern: {reason}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={confirmAppointment} loading={loading}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default BookServices;