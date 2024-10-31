// BookAppointmentStyles.js
import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const BookAppointmentStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 10
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
},
  doctorDetails: {
    flex: 4,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: sd.colors.blue,
    flex: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.semiBold,
    marginVertical: 10,
    //marginTop: 20,
    color: theme.colors.onBackground,
  },
  dataTableView:{
    backgroundColor: theme.colors.surface,
    margin: 0,
    borderRadius: 8

  },
  dataTableHeaderView:{
    backgroundColor: theme.colors.surfaceVariant,
    //textAlign: 'center',
    justifyContent: 'flex-start',
    borderRadius: 8
  },
  dataTableHeaderText:{
    color: theme.colors.onPrimaryContainer,
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.medium,
    textAlign: 'center',
    justifyContent: 'center',
  },
  dataTableCell:{
    backgroundColor: theme.colors.surface,    
  },
  dataTableText:{
    color: theme.colors.onSurface,
    fontFamily: sd.fonts.light,
    fontSize: sd.fontSizes.medium,
    flexWrap: 'wrap',
  },
  doctorImage:{
    flex: 1,
    // width: 40,
    // height: 40,
    borderRadius: 100
  },
  drName: {
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.black,
  },
  drSpecialty: {
    fontSize: 14,
    color: sd.colors.gray,
  },
  dateButton: {
    backgroundColor: sd.colors.lightBlue,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: sd.colors.darkBlue,
  },
  timeButton: {
    backgroundColor: sd.colors.lightBlue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  selectedTimeButton: {
    backgroundColor: sd.colors.darkBlue,
  },
  timeButtonText: {
    fontSize: 16,
    color: sd.colors.white,
  },
  textArea: {
    backgroundColor: sd.colors.white,
    borderRadius: 10,
    borderColor: sd.colors.lightBlue,
    borderWidth: 1,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: sd.colors.blue,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 100,
  },
  submitButtonText: {
    fontSize: 18,
    color: sd.colors.white,
    fontWeight: 'bold',
  },
});

export default BookAppointmentStyles;
