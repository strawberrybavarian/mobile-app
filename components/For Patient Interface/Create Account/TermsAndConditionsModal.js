import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import sd from '../../../utils/styleDictionary';

const styles = StyleSheet.create({
  bottomSheetModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    height: '70%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDDDDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: sd.fonts.bold || 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#000',
  },
  contentContainer: {
    flex: 1, 
    marginBottom: 90, // Space for buttons
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semibold || 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#000',
  },
  paragraph: {
    fontSize: 14,
    fontFamily: sd.fonts.regular || 'normal',
    marginBottom: 10,
    lineHeight: 20,
    color: '#333',
  },
  listTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.medium || 'medium',
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
  },
  listItem: {
    fontSize: 14,
    fontFamily: sd.fonts.regular || 'normal',
    marginLeft: 10,
    marginBottom: 5,
    lineHeight: 20,
    color: '#333',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: sd.fonts.medium || 'medium',
    color: '#000',
    textAlign: 'center',
  },
});

const TermsAndConditionsModal = ({ 
  isVisible, 
  onAccept, 
  onDecline
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onDecline}
      onBackButtonPress={onDecline}
      style={styles.bottomSheetModal}
      backdropOpacity={0.5}
      // Remove propagateSwipe so it doesn't interfere with scrolling
    >
      <View style={styles.bottomSheetContainer}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.modalTitle}>Terms and Conditions</Text>
        
        {/* Main content container */}
        <View style={styles.contentContainer}>
          <ScrollView
            style={{flex: 1}} 
            contentContainerStyle={{paddingBottom: 20}}
            showsVerticalScrollIndicator={true}
            bounces={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.sectionTitle}>Terms and Conditions</Text>
            <Text style={styles.paragraph}>Welcome to our Patient Information and Appointment Management System. By accessing or using our App, you agree to be bound by these Terms and Conditions ("Terms").</Text>
            
            <Text style={styles.listTitle}>1. Use of the App</Text>
            <Text style={styles.listItem}>• The App allows patients to manage their personal health information and appointments.</Text>
            <Text style={styles.listItem}>• You agree to use the App only for lawful purposes and in accordance with these Terms.</Text>
            
            <Text style={styles.listTitle}>2. User Accounts</Text>
            <Text style={styles.listItem}>• You must provide accurate and complete information when creating an account.</Text>
            <Text style={styles.listItem}>• You are responsible for maintaining the confidentiality of your account credentials.</Text>
            
            <Text style={styles.listTitle}>3. Intellectual Property</Text>
            <Text style={styles.listItem}>• All content in the App is the property of Molino Polyclinic and is protected by intellectual property laws.</Text>
            
            <Text style={styles.sectionTitle}>Data Privacy Policy</Text>
            <Text style={styles.paragraph}>Molino Polyclinic is committed to protecting your personal information in compliance with the Data Privacy Act of 2012 of the Philippines.</Text>
            
            <Text style={styles.listTitle}>1. Collection of Personal Information</Text>
            <Text style={styles.listItem}>• We collect personal information necessary for providing our services, including name, contact information, and health data.</Text>
            
            <Text style={styles.listTitle}>2. Use of Personal Information</Text>
            <Text style={styles.listItem}>• Your personal information is used to manage appointments and maintain your health records.</Text>
            <Text style={styles.listItem}>• We do not share your personal information with third parties without your consent, except as required by law.</Text>
            
            <Text style={styles.listTitle}>3. Your Rights</Text>
            <Text style={styles.listItem}>• You have the right to access, correct, and request deletion of your personal information.</Text>
            <Text style={styles.listItem}>• You may contact us to exercise your rights under the Data Privacy Act.</Text>
            
            <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
            <Text style={styles.paragraph}>Molino Polyclinic shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the App.</Text>
            
            <Text style={styles.sectionTitle}>5. Changes to Terms</Text>
            <Text style={styles.paragraph}>We reserve the right to modify these Terms at any time. Your continued use of the App constitutes your acceptance of the updated Terms.</Text>
            
            <Text style={styles.sectionTitle}>6. Termination</Text>
            <Text style={styles.paragraph}>We may terminate or suspend your account and bar access to the App immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.</Text>
            
            <Text style={styles.sectionTitle}>7. Governing Law</Text>
            <Text style={styles.paragraph}>These Terms shall be governed and construed in accordance with the laws of the Philippines, without regard to its conflict of law provisions.</Text>
          </ScrollView>
        </View>
        
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={onDecline}>
            <Text style={styles.modalButtonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalButton, {backgroundColor: sd.colors.blue}]} 
            onPress={onAccept}
          >
            <Text style={[styles.modalButtonText, {color: 'white'}]}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsAndConditionsModal;