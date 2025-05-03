import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    ActivityIndicator,
    RefreshControl,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { FontAwesome5 } from '@expo/vector-icons';
import sd from '../../../utils/styleDictionary';

// Utility function to strip HTML tags
const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

// Pre-process date formatting
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return "Date unavailable";
  }
};

// Optimize NewsItem with proper memoization and pre-processing
const NewsItem = memo(({ item, index, onPress }) => {
  // Pre-process data once instead of in render
  const imageUrl = useMemo(() => {
    return item.images && item.images.length > 0 
      ? `${ip.address}/${item.images[0]}`
      : `${ip.address}/uploads/default-news.jpg`;
  }, [item.images]);

  const formattedDate = useMemo(() => {
    return formatDate(item.published_date || item.createdAt || item.postedByInfo?.createdAt);
  }, [item.published_date, item.createdAt, item.postedByInfo?.createdAt]);

  const cleanContent = useMemo(() => {
    return stripHtmlTags(item.content || '');
  }, [item.content]);

  const itemAnimation = useRef(new Animated.Value(0)).current;
  
  // Run animation only once per item
  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      Animated.timing(itemAnimation, {
        toValue: 1,
        duration: 300, // Reduced from 400
        delay: Math.min(index * 50, 500), // Cap delay at 500ms
        useNativeDriver: true
      }).start();
    }, 0);
    
    return () => clearTimeout(animationTimeout);
  }, []);
  
  // Use callback to prevent recreation of function
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);
  
  return (
    <Animated.View
      style={{
        opacity: itemAnimation,
        transform: [{ 
          translateY: itemAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0] // Reduced animation distance
          })
        }]
      }}
    >
      <TouchableOpacity 
        style={styles.newsCard}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <Image 
          source={{ uri: imageUrl }}
          style={styles.newsImage}
          resizeMode="cover"
        />
        <View style={styles.newsContent}>
          <Text style={styles.newsHeadline} numberOfLines={2}>
            {item.headline || "News Update"}
          </Text>
          <Text style={styles.newsDate}>
            {formattedDate}
          </Text>
          <Text style={styles.newsExcerpt} numberOfLines={3}>
            {cleanContent}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // Implement custom comparison for memoization
  return prevProps.item._id === nextProps.item._id && 
         prevProps.index === nextProps.index;
});

const AllNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAllNews();
  }, []);

  // Pre-process news data after fetching
  const processNewsData = useCallback((newsData) => {
    return newsData.map(item => ({
      ...item,
      // Pre-process data to avoid doing it in render
      cleanContent: stripHtmlTags(item.content || ''),
      formattedDate: formatDate(item.published_date || item.createdAt || item.postedByInfo?.createdAt)
    }));
  }, []);
  
  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ip.address}/api/news/api/getgeneralnews`);
      if (response.data && Array.isArray(response.data.news)) {
        const processedNews = processNewsData(response.data.news.reverse());
        setNews(processedNews);
      }
    } catch (error) {
      console.error('Error fetching all news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [processNewsData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllNews();
  };

  // Optimize newsPress handler
  const handleNewsPress = useCallback((newsItem) => {
    navigation.navigate('NewsDetail', { newsItem });
  }, [navigation]);

  // Optimize renderItem with useCallback
  const renderNewsItem = useCallback(({ item, index }) => {
    return (
      <NewsItem 
        item={item} 
        index={index} 
        onPress={handleNewsPress} 
      />
    );
  }, [handleNewsPress]);

  // Use getItemLayout for fixed height items
  const getItemLayout = useCallback((data, index) => ({
    length: 250, // Approximate height of each news item
    offset: 250 * index,
    index,
  }), []);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="newspaper" size={50} color="#CCCCCC" />
      <Text style={styles.emptyStateText}>No news articles available</Text>
    </View>
  );

  const NewsSkeletonItem = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);
    
    return (
      <View style={styles.newsCard}>
        <Animated.View 
          style={[
            styles.skeletonImage, 
            { opacity }
          ]} 
        />
        <View style={styles.newsContent}>
          <Animated.View 
            style={[
              styles.skeletonTitle, 
              { opacity }
            ]} 
          />
          <Animated.View 
            style={[
              styles.skeletonDate, 
              { opacity }
            ]} 
          />
          <Animated.View 
            style={[
              styles.skeletonText, 
              { opacity }
            ]} 
          />
          <Animated.View 
            style={[
              styles.skeletonText, 
              { width: '70%', opacity }
            ]} 
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All News</Text>
        <View style={styles.spacer} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.listContainer}>
          <NewsSkeletonItem />
          <NewsSkeletonItem />
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          getItemLayout={getItemLayout}
          initialNumToRender={4}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[sd.colors.blue]}
              tintColor={sd.colors.blue}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7F9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: sd.fonts.bold,
        color: '#333',
    },
    spacer: {
        width: 30,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 50,
    },
    newsCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    newsImage: {
        width: '100%',
        height: 180,
    },
    newsContent: {
        padding: 16,
    },
    newsHeadline: {
        fontSize: 18,
        fontFamily: sd.fonts.bold,
        color: '#333',
        marginBottom: 6,
    },
    newsDate: {
        fontSize: 12,
        fontFamily: sd.fonts.regular,
        color: '#757575',
        marginBottom: 8,
    },
    newsExcerpt: {
        fontSize: 14,
        fontFamily: sd.fonts.regular,
        color: '#555',
        lineHeight: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        fontFamily: sd.fonts.medium,
        color: '#555',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: sd.fonts.medium,
        color: '#757575',
    },
    skeletonImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
    },
    skeletonTitle: {
        width: '80%',
        height: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonDate: {
        width: '50%',
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonText: {
        width: '100%',
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
});

export default AllNews;