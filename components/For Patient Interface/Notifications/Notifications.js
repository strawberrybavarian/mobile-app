import ActionSheet from "react-native-actions-sheet";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { getData } from "../../storageUtility";
import axios from "axios";
import { ip } from "../../../ContentExport";
import styles from "./NotificationsCSS";

const Notifications = () => {
    return (
        <ActionSheet>
            <View style={styles.container}>
                NOTIFICATiONS
            </View>
        </ActionSheet>
    )
};

export default Notifications;