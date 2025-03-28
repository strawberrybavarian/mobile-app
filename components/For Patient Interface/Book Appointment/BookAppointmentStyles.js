// BookAppointmentStyles.js
import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const BookAppointmentStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  subtitle: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.primary,
  },
  // Improved card styling
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: 16,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  drName: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  drSpecialty: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: theme.colors.onSurfaceVariant,
  },
  // Improved date button styling
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
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  // Better text area styling
  textArea: {
    minHeight: 100,
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
  },
  // Added error text style
  errorText: {
    color: theme.colors.error,
    marginBottom: 16,
    fontFamily: sd.fonts.regular,
  },
  // Added note style
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
    fontFamily: sd.fonts.light,
    color: theme.colors.onSurfaceVariant,
  },
  // Improved submit button
  submitButton: {
    marginVertical: 20,
    marginBottom: 100,
  },
  
  // Preserve existing modal and time selection styles
  timeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  timeButton: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 5,
    minWidth: '30%',
  },
  selectedTimeButton: {
    backgroundColor: theme.colors.primary,
  },
  timeButtonText: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.regular,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  selectedTimeButtonText: {
    color: theme.colors.onPrimary,
    fontFamily: sd.fonts.medium,
  },
  slotsText: {
    fontSize: sd.fontSizes.small,
    fontFamily: sd.fonts.regular,
  },
  noTimesText: {
    fontFamily: sd.fonts.italic,
    fontSize: sd.fontSizes.medium,
    color: theme.colors.error,
    textAlign: 'center',
    marginVertical: 20,
  },
  
  // Service first view styles
  serviceFirstContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  serviceHighlight: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  serviceHighlightTitle: {
    fontSize: 22,
    fontFamily: sd.fonts.semiBold,
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    marginBottom: 8,
  },
  serviceHighlightCategory: {
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  findDoctorButton: {
    width: '100%',
    paddingVertical: 12,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  modalTitle: {
    fontSize: sd.fontSizes.large,
    fontFamily: sd.fonts.semiBold,
    color: theme.colors.onBackground,
  },
  modalSubtitle: {
    fontSize: sd.fontSizes.medium,
    fontFamily: sd.fonts.medium,
    color: theme.colors.onSurfaceVariant,
    marginTop: 16,
    marginBottom: 8,
  },
  calendarText: {
    fontFamily: sd.fonts.regular,
    color: theme.colors.onBackground,
  },
  calendarMonthTitle: {
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.large,
    color: theme.colors.primary,
  },
  calendarYearTitle: {
    fontFamily: sd.fonts.medium,
    fontSize: sd.fontSizes.medium,
    color: theme.colors.primary,
  },
  calendarDayLabels: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCloseButtonText: {
    fontSize: sd.fontSizes.medium,
    fontFamily: sd.fonts.semiBold,
  },
  
  // Dropdown styles
  dropdown: {
    height: 50,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  disabledDropdown: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.outlineVariant,
    opacity: 0.8,
  },
  dropdownPlaceholder: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: sd.fonts.regular,
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: theme.colors.onSurface,
    fontFamily: sd.fonts.medium,
    fontSize: 16,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  dropdownItem: {
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    color: theme.colors.onSurface,
    fontFamily: sd.fonts.regular,
    fontSize: 16,
  },
  dropdownLeftIcon: {
    marginRight: 10,
  },
  
  // Table styles (preserved)
  dataTableView: {
    backgroundColor: theme.colors.surface,
    margin: 0,
    borderRadius: 8,
  },
  dataTableHeaderView: {
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'flex-start',
    borderRadius: 8,
  },
  dataTableHeaderText: {
    color: theme.colors.onPrimaryContainer,
    fontFamily: sd.fonts.semiBold,
    fontSize: sd.fontSizes.medium,
    textAlign: 'center',
    justifyContent: 'center',
  },
  dataTableCell: {
    backgroundColor: theme.colors.surface,    
  },
  dataTableText: {
    color: theme.colors.onSurface,
    fontFamily: sd.fonts.light,
    fontSize: sd.fontSizes.medium,
    flexWrap: 'wrap',
  },
});

export default BookAppointmentStyles;