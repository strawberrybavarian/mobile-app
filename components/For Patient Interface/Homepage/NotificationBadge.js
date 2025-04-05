import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import sd from '@/utils/styleDictionary';

const NotificationBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: sd.colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: sd.fonts.bold,
    textAlign: 'center',
  }
});

export default NotificationBadge;