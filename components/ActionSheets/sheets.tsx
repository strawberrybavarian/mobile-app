import React from 'react';
import ActionSheet, { registerSheet, SheetDefinition, SheetManager } from 'react-native-actions-sheet';
import { Text, View, Button } from 'react-native';
import Notifications from '../For Patient Interface/Notifications/Notifications';

registerSheet('notifications', Notifications);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'notifications':  SheetDefinition;
  }
}

export {}
