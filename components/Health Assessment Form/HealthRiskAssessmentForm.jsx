import React, { useState } from 'react';
import { View, Text, Picker, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

const HealthRiskAssessmentForm = () => {
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
  };

  const screenHeight = Dimensions.get('window').height;

  return (
    <ScrollView contentContainerStyle={{ minHeight: screenHeight }}>
      <View style={styles.container}>
        <Text style={styles.header}>Health Risk Assessment Form</Text>

        {/* Question 1 */}
        <View style={styles.questionContainer}>
          <Text>1. Do you smoke or use tobacco products?</Text>
          <Picker
            selectedValue={smoking}
            onValueChange={(value) => setSmoking(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes, regularly" value="Yes, regularly" />
            <Picker.Item label="Yes, occasionally" value="Yes, occasionally" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>

        {/* Question 2 */}
        <View style={styles.questionContainer}>
          <Text>2. How often do you engage in physical activity?</Text>
          <Picker
            selectedValue={physicalActivity}
            onValueChange={(value) => setPhysicalActivity(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="2-3 times a week" value="2-3 times a week" />
            <Picker.Item label="Rarely or never" value="Rarely or never" />
          </Picker>
        </View>

        {/* Question 3 */}
        <View style={styles.questionContainer}>
          <Text>3. How many hours of sleep do you typically get per night?</Text>
          <Picker
            selectedValue={sleepHours}
            onValueChange={(value) => setSleepHours(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="7-9 hours" value="7-9 hours" />
            <Picker.Item label="5-6 hours" value="5-6 hours" />
            <Picker.Item label="Less than 5 hours" value="Less than 5 hours" />
          </Picker>
        </View>

        {/* Question 4 */}
        <View style={styles.questionContainer}>
          <Text>4. How would you describe your stress levels?</Text>
          <Picker
            selectedValue={stressLevel}
            onValueChange={(value) => setStressLevel(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Moderate" value="Moderate" />
            <Picker.Item label="High" value="High" />
          </Picker>
        </View>

        {/* Question 5 */}
        <View style={styles.questionContainer}>
          <Text>5. How often do you consume alcoholic beverages?</Text>
          <Picker
            selectedValue={alcoholConsumption}
            onValueChange={(value) => setAlcoholConsumption(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Never" value="Never" />
            <Picker.Item label="Occasionally (1-2 times a month)" value="Occasionally" />
            <Picker.Item label="Regularly (more than 2 times a week)" value="Regularly" />
          </Picker>
        </View>

        {/* Question 6 */}
        <View style={styles.questionContainer}>
          <Text>6. Do you have a family history of chronic illnesses?</Text>
          <Picker
            selectedValue={familyHistory}
            onValueChange={(value) => setFamilyHistory(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Not sure" value="Not sure" />
          </Picker>
        </View>

        {/* Question 7 */}
        <View style={styles.questionContainer}>
          <Text>7. Are you up to date on your vaccinations?</Text>
          <Picker
            selectedValue={vaccinationStatus}
            onValueChange={(value) => setVaccinationStatus(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes, all up to date" value="Yes, all up to date" />
            <Picker.Item label="Some vaccinations are due" value="Some vaccinations are due" />
            <Picker.Item label="No vaccinations received" value="No vaccinations received" />
          </Picker>
        </View>

        {/* Question 8 */}
        <View style={styles.questionContainer}>
          <Text>8. How would you rate your overall diet?</Text>
          <Picker
            selectedValue={dietRating}
            onValueChange={(value) => setDietRating(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Healthy and balanced" value="Healthy and balanced" />
            <Picker.Item label="Moderately healthy" value="Moderately healthy" />
            <Picker.Item label="Unhealthy" value="Unhealthy" />
          </Picker>
        </View>

        {/* Question 9 */}
        <View style={styles.questionContainer}>
          <Text>9. Have you had any major surgeries or medical procedures?</Text>
          <Picker
            selectedValue={majorSurgeries}
            onValueChange={(value) => setMajorSurgeries(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes, within the last year" value="Yes, within the last year" />
            <Picker.Item label="Yes, within the last 5 years" value="Yes, within the last 5 years" />
            <Picker.Item label="No major surgeries or procedures" value="No major surgeries or procedures" />
          </Picker>
        </View>

        {/* Question 10 */}
        <View style={styles.questionContainer}>
          <Text>10. Do you have any known allergies?</Text>
          <Picker
            selectedValue={allergies}
            onValueChange={(value) => setAllergies(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>

        {/* Question 11 */}
        <View style={styles.questionContainer}>
          <Text>11. Have you experienced any recent sneezing or coughing?</Text>
          <Picker
            selectedValue={recentSneezingCoughing}
            onValueChange={(value) => setRecentSneezingCoughing(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Not sure" value="Not sure" />
          </Picker>
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
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HealthRiskAssessmentForm;
