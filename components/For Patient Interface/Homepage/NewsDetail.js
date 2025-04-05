import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ip } from '../../../ContentExport';
import { FontAwesome5 } from '@expo/vector-icons';
import sd from '@/utils/styleDictionary';

const { width } = Dimensions.get('window');

const NewsDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const scrollViewRef = useRef(null);

    // Get the news item directly from navigation params
    const { newsItem } = route.params;
    
    console.log('News item in detail:', newsItem);

    // Function to strip HTML tags
    const stripHtmlTags = (html) => {
        if (!html) return '';
        
        // First replace common line break tags with newlines
        const withLineBreaks = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<\/div>/gi, '\n');
        
        // Then strip all remaining HTML tags
        const withoutTags = withLineBreaks.replace(/<[^>]*>/g, '');
        
        // Decode HTML entities
        return withoutTags
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');
    };

    const goToPreviousImage = () => {
        if (newsItem?.images?.length > 1) {
            const prevIndex = (activeImageIndex - 1 + newsItem.images.length) % newsItem.images.length;
            setActiveImageIndex(prevIndex);
            scrollViewRef.current?.scrollTo({
                x: prevIndex * width,
                animated: true
            });
        }
    };

    const goToNextImage = () => {
        if (newsItem?.images?.length > 1) {
            const nextIndex = (activeImageIndex + 1) % newsItem.images.length;
            setActiveImageIndex(nextIndex);
            scrollViewRef.current?.scrollTo({
                x: nextIndex * width,
                animated: true
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome5 name="arrow-left" size={20} color={sd.colors.blue} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>News</Text>
                <View style={{width: 40}} />
            </View>

            {!newsItem ? (
                <View style={styles.errorContainer}>
                    <FontAwesome5 name="exclamation-circle" size={50} color="#ccc" />
                    <Text style={styles.errorText}>News article not found</Text>
                </View>
            ) : (
                <ScrollView style={styles.contentContainer}>
                    {/* News headline */}
                    <Text style={styles.headline}>
                        {newsItem.headline || "Untitled News"}
                    </Text>
                    
                    <Text style={styles.date}>
                        Published on {new Date(newsItem.published_date || newsItem.postedByInfo?.createdAt).toLocaleDateString()}
                    </Text>
                    
                    {/* Image carousel if there are images */}
                    {newsItem.images && newsItem.images.length > 0 && (
                        <View style={styles.imageContainer}>
                            {/* Left Arrow */}
                            {newsItem.images.length > 1 && (
                                <TouchableOpacity 
                                    style={styles.imageArrow}
                                    activeOpacity={0.7}
                                    onPress={goToPreviousImage}
                                >
                                    <FontAwesome5 name="chevron-left" size={18} color="white" />
                                </TouchableOpacity>
                            )}
                            
                            <ScrollView 
                                ref={scrollViewRef}
                                horizontal 
                                pagingEnabled 
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) => {
                                    const contentOffset = e.nativeEvent.contentOffset;
                                    const viewSize = e.nativeEvent.layoutMeasurement;
                                    const newIndex = Math.floor(contentOffset.x / viewSize.width);
                                    setActiveImageIndex(newIndex);
                                }}
                            >
                                {newsItem.images.map((image, index) => (
                                    <View key={index} style={styles.imageWrapper}>
                                        <Image 
                                            source={{ uri: `${ip.address}/${image}` }} 
                                            style={styles.image} 
                                            resizeMode="contain"
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                            
                            {/* Right Arrow */}
                            {newsItem.images.length > 1 && (
                                <TouchableOpacity 
                                    style={[styles.imageArrow, styles.imageArrowRight]}
                                    activeOpacity={0.7}
                                    onPress={goToNextImage}
                                >
                                    <FontAwesome5 name="chevron-right" size={18} color="white" />
                                </TouchableOpacity>
                            )}
                            
                            {/* Pagination dots */}
                            {newsItem.images.length > 1 && (
                                <View style={styles.paginationContainer}>
                                    {newsItem.images.map((_, index) => (
                                        <View 
                                            key={index}
                                            style={[
                                                styles.paginationDot,
                                                index === activeImageIndex && styles.activePaginationDot
                                            ]} 
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    
                    {/* News content */}
                    <Text style={styles.newsContent}>
                        {stripHtmlTags(newsItem.content)}
                    </Text>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        ...sd.shadows.small,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: sd.fonts.semiBold,
        color: sd.colors.blue,
    },
    contentContainer: {
        padding: 16,
    },
    headline: {
        fontSize: 22,
        fontFamily: sd.fonts.bold,
        color: '#333',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        fontFamily: sd.fonts.regular,
        color: '#666',
        marginBottom: 16,
    },
    imageContainer: {
        height: width * 1.2, // More reasonable height
        marginBottom: 20,
        marginTop: 10,
        position: 'relative',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    imageWrapper: {
        width: width - 32, // Full width minus padding
        height: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width - 48, // Good margins on sides
        height: width, // Slightly smaller than container
        borderRadius: 8,
    },
    imageArrow: {
        position: 'absolute',
        top: '50%',
        left: 8,
        zIndex: 10,
        marginTop: -20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    imageArrowRight: {
        left: undefined,
        right: 8,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
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
    newsContent: { // Renamed from 'content' to avoid style name collision
        fontSize: 16,
        fontFamily: sd.fonts.regular,
        lineHeight: 24,
        color: '#333',
        marginBottom: 150,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        fontFamily: sd.fonts.medium,
        color: '#666',
        marginTop: 10,
    },
});

export default NewsDetail;