import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Badge, Avatar, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ip } from '@/ContentExport';
import { SafeAreaView } from 'react-native-safe-area-context';
import sd from '@/utils/styleDictionary';

const DrPostScreen = ({ navigation, route }) => {
    const { doctorId, fetchPosts, drimg } = route.params || {};
    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const theme = useTheme();
    const styles = createStyles(theme);
  
    const handleImagePick = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
      });
      if (result?.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    };
  
    const handlePostSubmit = async () => {
        if (content === "") {
          Alert.alert("Content is empty!");
          return;
        }
      
        try {
          const formData = new FormData();
          
          formData.append("content", content);
          formData.append("doctor_id", doctorId);
          
          selectedImages.forEach((imageUri) => {
            formData.append(`images`, {
              uri: imageUri,
              type: "image/jpeg",
              name: imageUri.split("/").pop(),
            });
          });
      
          await axios.post(`${ip.address}/api/doctor/api/addpost/${doctorId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
          fetchPosts();
          navigation.goBack();
        } catch (error) {
          console.error("Error submitting post:", error);
          Alert.alert("Error submitting post", error.message);
        }
    };
      
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable 
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            
            <Text style={styles.headerTitle}>Create Post</Text>
            
            <Pressable 
              onPress={handlePostSubmit}
              style={styles.headerButton}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </Pressable>
          </View>
          
          {/* Content Area */}
          <View style={styles.contentContainer}>
            <Avatar.Image
              size={32}
              source={{ uri: drimg ? `${ip.address}/${drimg}` : '' }}
              style={styles.avatar}
            />
            <TextInput
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              style={styles.input}
              autoFocus
              placeholder='Write your post here...'
              placeholderTextColor="#888"
            />
          </View>
          
          {/* Main area flex spacer */}
          <View style={styles.flexSpacer} />
          
          {/* Image Selection Area */}
          <View style={styles.imageSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.imageScrollView}
              contentContainerStyle={styles.imageContainer}
            >
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: image }} 
                    style={styles.image} 
                  />
                  <Badge
                    style={styles.badge}
                    size={16}
                    onPress={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                  >
                    ✕
                  </Badge>
                </View>
              ))}
            </ScrollView>

            <Button 
              mode="contained" 
              onPress={handleImagePick}
              style={styles.pickImageButton}
              labelStyle={styles.buttonLabel}
              icon="image"
              compact={true}
            >
              Pick Images
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
};
  
const createStyles = (theme) =>
  StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: theme.colors.background
    },
    keyboardView: {
      flex: 1,
      padding: 12,
      display: 'flex',
      flexDirection: 'column'
    },
    header: { 
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: '#e0e0e0',
    },
    headerTitle: { 
      fontSize: 16,
      fontFamily: sd.fonts.medium,
      color: theme.colors.text
    },
    headerButton: {
      padding: 6, 
    },
    backButtonText: { 
      fontSize: 14, 
      fontFamily: sd.fonts.medium,
      color: theme.colors.primary 
    },
    postButtonText: { 
      fontSize: 14, 
      fontFamily: sd.fonts.medium,
      color: theme.colors.primary,
      fontWeight: 'bold'
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 12,
      flex: 0,
    },
    avatar: {
      marginRight: 8,
      marginTop: 4
    },
    input: {
      flex: 1,
      minHeight: 100,
      backgroundColor: 'transparent',
      fontSize: 14,
      fontFamily: sd.fonts.regular,
      color: theme.colors.text,
      textAlignVertical: 'top',
      padding: 0
    },
    flexSpacer: {
      flex: 1
    },
    imageSection: {
      marginTop: 12
    },
    pickImageButton: {
      marginTop: 8,
      borderRadius: 6,
      height: 40,
      justifyContent: 'center',
      paddingHorizontal: 16,
      alignItems: 'center',
      marginBottom: 8,
    },
    buttonLabel: {
      fontFamily: sd.fonts.medium,
      fontSize: 12,
      marginVertical: 2,
      textAlign: 'center',
    },
    imageScrollView: {
      maxHeight: 90,
    },
    imageContainer: {
      flexDirection: 'row',
      paddingVertical: 6,
    },
    imageWrapper: {
      marginRight: 8,
      position: 'relative',
    },
    image: { 
      width: 64, 
      height: 64, 
      borderRadius: 6 
    },
    badge: { 
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.error,
    },
  });
  
export default DrPostScreen;
