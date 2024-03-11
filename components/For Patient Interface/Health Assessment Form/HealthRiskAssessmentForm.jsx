import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';

const HealthRiskAssessmentForm = ({navigation}) => {
  const [smoking, setSmoking] = useState('');
  const [physicalActivity, setPhysicalActivity] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [vaccinationStatus, setVaccinationStatus] = useState('');
  const [dietRating, setDietRating] = useState('');
  const [majorSurgeries, setMajorSurgeries] = useState('');
  const [allergies, setAllergies] = useState('');
  const [recentSneezingCoughing, setRecentSneezingCoughing] = useState('');

  const handleFormSubmit = () => {
    console.log({
      smoking,
      physicalActivity,
      sleepHours,
      stressLevel,
      alcoholConsumption,
      familyHistory,
      vaccinationStatus,
      dietRating,
      majorSurgeries,
      allergies,
      recentSneezingCoughing,
    });

    navigation.navigate('upcoming')
  };

  const screenHeight = Dimensions.get('window').height;

  return (
    <ScrollView contentContainerStyle={{ minHeight: screenHeight }}>
      <View style={styles.container}>
        <Text style={styles.header}>Health Risk Assessment Form</Text>

        {/* Question 1 */}
        <View style={styles.questionContainer}>
          <Text>1. Do you smoke or use tobacco products?</Text>
                <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setSmoking(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  

                


        </View>

        {/* Question 2 */}
        <View style={styles.questionContainer}>
          <Text>2. How often do you engage in physical activity?</Text>
              <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setPhysicalActivity(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 3 */}
        <View style={styles.questionContainer}>
          <Text>3. How many hours of sleep do you typically get per night?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setSleepHours(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 4 */}
        <View style={styles.questionContainer}>
          <Text>4. How would you describe your stress levels?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setStressLevel(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 5 */}
        <View style={styles.questionContainer}>
          <Text>5. How often do you consume alcoholic beverages?</Text>
              <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setAlcoholConsumption(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 6 */}
        <View style={styles.questionContainer}>
          <Text>6. Do you have a family history of chronic illnesses?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setPhysicalActivity(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 7 */}
        <View style={styles.questionContainer}>
          <Text>7. Are you up to date on your vaccinations?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setVaccinationStatus(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 8 */}
        <View style={styles.questionContainer}>
          <Text>8. How would you rate your overall diet?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setDietRating(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 9 */}
        <View style={styles.questionContainer}>
          <Text>9. Have you had any major surgeries or medical procedures?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setMajorSurgeries(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 10 */}
        <View style={styles.questionContainer}>
          <Text>10. Do you have any known allergies?</Text>
          <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setAllergies(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        {/* Question 11 */}
        <View style={styles.questionContainer}>
          <Text>11. Have you experienced any recent sneezing or coughing?</Text>
              <PickerSelect
                  placeholder={{ label: 'Select', value: null }}
                  onValueChange={(value) => setPhysicalActivity(value)}
                  selectedValue={smoking}
                  items={[
                  { label: 'Yes, regularly', value: 'Yes, regularly' },
                  { label: 'Yes, occasionally', value: 'Yes, occasionally' },
                  { label: 'No', value: 'Yes, no' },

                  ]}
                  style={{
                    inputIOS: styles.picker,
                    inputAndroid: styles.picker,
                  }}
                />  
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
    width: '100%', // Adjust width as needed
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%', // Adjust width as needed
  },
  submitButton: {
    backgroundColor: '#92a3fd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HealthRiskAssessmentForm;
