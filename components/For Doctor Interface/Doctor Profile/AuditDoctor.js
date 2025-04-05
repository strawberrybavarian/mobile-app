import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  ScrollView
} from 'react-native';
import { Card, Badge, Divider, useTheme, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import { useUser } from '../../../UserContext';
import sd from '../../../utils/styleDictionary';
import SelectDropdown from 'react-native-select-dropdown';

const AuditDoctor = () => {
  const { user } = useUser();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterTimespan, setFilterTimespan] = useState('all');
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();

  // Activity statistics
  const [stats, setStats] = useState({
    total: 0,
    login: 0,
    appointments: 0,
    other: 0,
  });

  const actionTypes = ["All Activities", "Login Activities", "Appointment Activities", "Update Activities"];
  const timespans = ["All Time", "Today", "Last 7 Days", "Last 30 Days"];

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getData('userId');
      if (id) {
        setUserId(id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;
    
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get(`${ip.address}/api/doctor/api/getaudit/${userId}`);
        const doctorData = res.data;
        setDoctorData(doctorData);
        
        // Calculate statistics
        if (doctorData && doctorData.audits) {
          const loginCount = doctorData.audits.filter(audit => 
            audit.action.toLowerCase().includes('login')).length;
          const appointmentCount = doctorData.audits.filter(audit => 
            audit.action.toLowerCase().includes('appointment')).length;
          
          setStats({
            total: doctorData.audits.length,
            login: loginCount,
            appointments: appointmentCount,
            other: doctorData.audits.length - loginCount - appointmentCount
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching audit data:', err);
        setError(`Error fetching activity log: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [userId]);

  // Filter audits based on search term, selected filter, and timespan
  const getFilteredAudits = () => {
    if (!doctorData || !doctorData.audits) return [];

    let filtered = [...doctorData.audits];

    // Filter by action type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(audit => 
        audit.action.toLowerCase().includes(selectedFilter.toLowerCase()));
    }

    // Filter by timespan
    const now = new Date();
    if (filterTimespan === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(audit => new Date(audit.createdAt) >= today);
    } else if (filterTimespan === 'week') {
      const lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      filtered = filtered.filter(audit => new Date(audit.createdAt) >= lastWeek);
    } else if (filterTimespan === 'month') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filtered = filtered.filter(audit => new Date(audit.createdAt) >= lastMonth);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(audit => 
        audit.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        audit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (audit.ipAddress && audit.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const getStatusColor = (action) => {
    if (action.toLowerCase().includes('login')) {
      return theme.colors.success || '#2e7d32';
    } else if (action.toLowerCase().includes('appointment')) {
      return theme.colors.info || '#0288d1';
    } else if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('cancel')) {
      return theme.colors.error || '#d32f2f';
    } else {
      return theme.colors.primary || '#1976d2';
    }
  };

  const getStatusIcon = (action) => {
    if (action.toLowerCase().includes('login')) {
      return 'shield-alt';
    } else if (action.toLowerCase().includes('appointment')) {
      return 'calendar-alt';
    } else if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('cancel')) {
      return 'exclamation-triangle';
    } else {
      return 'history';
    }
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.createdAt);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    
    return (
      <Card style={styles.auditCard}>
        <Card.Content>
          <View style={styles.badgeContainer}>
            <FontAwesome5 
              name={getStatusIcon(item.action)} 
              size={14} 
              color={getStatusColor(item.action)} 
              style={styles.badgeIcon} 
            />
            <Text style={[styles.badgeText, { color: getStatusColor(item.action) }]}>
              {item.action}
            </Text>
          </View>
          
          <Text style={styles.descriptionText}>{item.description}</Text>
          
          <View style={styles.timestampContainer}>
            <FontAwesome5 name="clock" size={12} color="#757575" style={styles.timestampIcon} />
            <Text style={styles.timestampText}>{formattedDate} at {formattedTime}</Text>
          </View>
          
          {item.ipAddress && (
            <View style={styles.ipContainer}>
              <FontAwesome5 name="network-wired" size={12} color="#757575" style={styles.ipIcon} />
              <Text style={styles.ipText}>{item.ipAddress}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading activity logs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome5 name="exclamation-triangle" size={24} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const filteredAudits = getFilteredAudits();

  return (
    <SafeAreaView style={styles.container}>
      {/* Updated Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={18} color={sd.colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <FontAwesome5 name="shield-alt" size={20} color={theme.colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Activity Logs</Text>
        </View>
        
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Card style={[styles.statsCard, { borderLeftColor: theme.colors.primary }]}>
              <Card.Content style={styles.statsCardContent}>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsLabel}>Total Activities</Text>
                  <Text style={styles.statsValue}>{stats.total}</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.statsCard, { borderLeftColor: theme.colors.success || '#4CAF50' }]}>
              <Card.Content style={styles.statsCardContent}>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsLabel}>Login Activities</Text>
                  <Text style={styles.statsValue}>{stats.login}</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={[styles.statsCard, { borderLeftColor: theme.colors.info || '#2196F3' }]}>
              <Card.Content style={styles.statsCardContent}>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsLabel}>Appointment Activities</Text>
                  <Text style={styles.statsValue}>{stats.appointments}</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.statsCard, { borderLeftColor: theme.colors.warning || '#FFC107', height: '100%' }]}>
              <Card.Content style={styles.statsCardContent}>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsLabel}>Other Activities</Text>
                  <Text style={styles.statsValue}>{stats.other}</Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>
        
        {/* Audit List */}
        {filteredAudits.length > 0 ? (
          <View style={styles.listContainer}>
            {filteredAudits.map((item, index) => (
              <View key={item._id || index.toString()}>
                {renderItem({ item })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="history" size={40} color="#BDBDBD" />
            <Text style={styles.emptyText}>No activities found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.textPrimary,
  },
  headerRightPlaceholder: {
    width: 40, // Same width as back button for balance
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 6, // Add spacing between cards
    borderLeftWidth: 4,
    borderRadius: 8,
    ...sd.shadows.small,
  },
  statsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTextContainer: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: sd.fonts.semiBold,
    color: sd.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statsValue: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    color: sd.colors.textPrimary,
  },
  listContainer: {
    paddingBottom: 24,
    marginHorizontal: 8,
  },
  auditCard: {
    marginBottom: 12,
    borderRadius: 8,
    ...sd.shadows.small,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: sd.fonts.semiBold,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: sd.fonts.regular,
    color: sd.colors.textPrimary,
    marginBottom: 12,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timestampIcon: {
    marginRight: 6,
  },
  timestampText: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: sd.colors.textSecondary,
  },
  ipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ipIcon: {
    marginRight: 6,
  },
  ipText: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: sd.colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: sd.colors.error || '#d32f2f',
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: sd.fonts.medium,
    color: sd.colors.textSecondary,
  },
  emptySubText: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#9e9e9e',
  },
});

export default AuditDoctor;