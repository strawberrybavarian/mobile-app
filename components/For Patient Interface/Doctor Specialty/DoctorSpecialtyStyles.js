import { StyleSheet } from 'react-native';
import sd from '../../../utils/styleDictionary';

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    marginVertical: 10,
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
  },
  specialtySection: {
    marginTop: 10,
    flexDirection: 'column',
    padding: 10,
  },
  specialtyHeader: {
    paddingLeft: 20,
    marginLeft: 3,
    fontFamily: 'Poppins-SemiBold',
    fontSize: sd.fontSizes.xl,
  },
  specialtyButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  specialtyButton: {
    backgroundColor: '#F9F5FF',
    width: '48%',
    height: 120,
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  specialtyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyImage: {
    width: 90,
    height: 90,
  },
  buttonText: {
    fontFamily: "Poppins",
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});

export default styles;
