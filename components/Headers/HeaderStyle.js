import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import sd from '../../utils/styleDictionary';
import { useTheme } from 'react-native-paper';



export default headerStyles = (theme) => StyleSheet.create({
  mainContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
    width: '100%',
    height: 'auto',
    ...sd.shadows.level1,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: theme.colors.background,
    zIndex: 100,
  },
  wrapper: {
    flexDirection: "row",
    height: 60,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  textCont: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    marginLeft: 5,
  },
  infoCont: {
    flexDirection: "row",
    width: 200,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
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
  notificationButton: {
    padding: 10,
    marginLeft: 'auto',
    zIndex: 2,
  },
  bellContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 999,
    // Add shadow for better visibility
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});