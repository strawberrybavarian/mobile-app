import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Button, Badge, Avatar, ActivityIndicator, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ip } from '../../../../ContentExport';
import { SafeAreaView } from 'react-native-safe-area-context';
import sd from '../../../../utils/styleDictionary';

// Move this function outside the component so it's defined before use
const calculateWordCount = (text) => {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

const EditPostScreen = ({ navigation, route }) => {
  const { 
    postId, 
    doctorId, 
    fetchPosts, 
    postContent, 
    postImages, 
    drimg 
  } = route.params || {};
  
  const [content, setContent] = useState(postContent || "");
  const [existingImages, setExistingImages] = useState(postImages || []);
  const [selectedImages, setSelectedImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(calculateWordCount(postContent || ""));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const theme = useTheme();
  const contentInputRef = useRef(null);
  const styles = createStyles(theme);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    // Auto focus the TextInput on component mount
    setTimeout(() => {
      if (contentInputRef.current) {
        contentInputRef.current.focus();
      }
    }, 100);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleImagePick = async () => {
    // Dismiss keyboard before opening image picker
    Keyboard.dismiss();
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    
    if (result?.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleImageDelete = (imageToDelete, isNewImage) => {
    if (isNewImage) {
      setSelectedImages((prev) => prev.filter((image) => image !== imageToDelete));
    } else {
      setDeletedImages((prev) => [...prev, imageToDelete]);
      setExistingImages((prev) => prev.filter((image) => image !== imageToDelete));
    }
  };

  const handleUpdate = async () => {
    // Check if content is empty
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty.");
      return;
    }
    
    // Check if word count exceeds limit
    if (wordCount > 500) {
      Alert.alert("Word Count Exceeded", "Please keep your post under 500 words.");
      return;
    }
  
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to save changes to this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async () => {
            const formData = new FormData();
            formData.append("content", content);
  
            // Add existing images that weren't deleted
            existingImages.forEach((image) => {
              formData.append("images", image);
            });
  
            // Add newly selected images
            selectedImages.forEach((imageUri) => {
              formData.append("images", {
                uri: imageUri,
                type: "image/jpeg",
                name: imageUri.split("/").pop(),
              });
            });
  
            // Add list of images to delete
            formData.append("deletedImages", JSON.stringify(deletedImages));
  
            try {
              setLoading(true);
              await axios.put(
                `${ip.address}/api/doctor/api/post/updatepost/${doctorId}/${postId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              fetchPosts(); // Refresh posts after update
              navigation.goBack(); // Navigate back
            } catch (error) {
              console.error("Error updating post:", error);
              Alert.alert("Error updating post", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight : 20 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable 
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            
            <Text style={styles.headerTitle}>Edit Post</Text>
            
            <Pressable 
              onPress={handleUpdate}
              style={[styles.headerButton, { backgroundColor: theme.colors.primary, paddingHorizontal: 20 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={[styles.postButtonText, {color: 'white'}]}>Save</Text>
              )}
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
              ref={contentInputRef}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                setWordCount(calculateWordCount(text));
              }}
              multiline
              numberOfLines={4}
              style={styles.input}
              placeholder="Update your post content..."
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.wordCountContainer}>
            <Text style={[
              styles.wordCount,
              wordCount > 450 && wordCount <= 500 ? styles.wordCountWarning : null,
              wordCount > 500 ? styles.wordCountExceeded : null
            ]}>
              {wordCount} / 500 words
            </Text>
          </View>
          
          {/* Image Selection Area */}
          <View style={styles.imageSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.imageScrollView}
              contentContainerStyle={styles.imageContainer}
              keyboardShouldPersistTaps="handled"
            >
              {existingImages.map((image, index) => (
                <View key={`existing-${index}`} style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: `${ip.address}/${image}` }} 
                    style={styles.image} 
                  />
                  <Badge
                    style={styles.badge}
                    size={16}
                    onPress={() => handleImageDelete(image, false)}
                  >
                    ✕
                  </Badge>
                </View>
              ))}
              {selectedImages.map((image, index) => (
                <View key={`new-${index}`} style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: image }} 
                    style={styles.image} 
                  />
                  <Badge
                    style={styles.badge}
                    size={16}
                    onPress={() => handleImageDelete(image, true)}
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
        </ScrollView>
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
    },
    scrollContent: {
      flexGrow: 1,
      padding: 12,
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
      fontSize: 22,
      fontFamily: sd.fonts.medium,
      color: theme.colors.text
    },
    headerButton: {
      padding: 6,
      borderRadius: 6,
      paddingHorizontal: 20
    },
    backButtonText: { 
      fontSize: 16, 
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.primary
    },
    postButtonText: { 
      fontSize: 16, 
      fontFamily: sd.fonts.semiBold,
      color: theme.colors.primary,
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
    wordCountContainer: {
      marginTop: 8,
      alignItems: 'flex-end',
    },
    wordCount: {
      fontSize: 12,
      fontFamily: sd.fonts.medium,
      color: theme.colors.text,
    },
    wordCountWarning: {
      color: theme.colors.warning,
    },
    wordCountExceeded: {
      color: theme.colors.error,
    },
    imageSection: {
      marginTop: 12,
      marginBottom: 20,
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

export default EditPostScreen;
