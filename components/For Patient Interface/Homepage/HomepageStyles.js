import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import sd from "../../../utils/styleDictionary";

const { width } = Dimensions.get('window');
const numColumns = 2;

const styles = StyleSheet.create({
  // Base container styles
  mainContaineer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    paddingBottom: Dimensions.get('window').height / 10,
  },
  headercont: {
    marginTop: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
    ...sd.shadows.medium,
  },
  headerTextCont: {
    flex: 1,
    flexDirection: "column",
    padding: 3,
    marginLeft: 3,
  },
  textCont: {
    flexDirection: "row",
    width: 150,
  },
  navcontainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: sd.fonts.semiBold,
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    marginHorizontal: 40,
  },

  // News carousel styles
  newsCarouselContainer: {
    height: width * 0.8,
    backgroundColor: '#f8f8f8',
    marginTop: 10,
    marginBottom: 15,
    position: 'relative',
  },
  newsCarouselPlaceholder: {
    height: width * 0.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 12,
    marginHorizontal: 15,
  },
  newsSlide: {
    width: width - 30,
    height: width * 0.7,
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(57, 40, 96, 0.6)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  newsHeadline: {
    fontSize: 16,
    color: 'white',
    fontFamily: sd.fonts.semiBold,
    marginBottom: 4,
  },
  newsDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: sd.fonts.regular,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 3,
  },
  activePaginationDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Services styles
  optionsContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  optionBox: {
    width: (width - 50) / numColumns,
    height: (width - 40) / numColumns * 0.8,
    margin: 5,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginBottom: 7,
    alignSelf: 'center'
  },
  optionImage: {
    fontSize: 22,
    marginBottom: 6,
    color: sd.colors.blue,
  },
  optionText: {
    textAlign: 'center',
    fontFamily: sd.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
  },

  // Specialties styles
  specialtyBox: {
    width: (width - 50) / numColumns,
    height: (width - 30) / numColumns * 0.8,
    margin: 5,
    marginBottom: 8,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyImage: {
    fontSize: 22,
    marginBottom: 6,
    color: sd.colors.secondary,
  },
});

export default styles;