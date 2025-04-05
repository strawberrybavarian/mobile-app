import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Card, Badge, Searchbar, Divider } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { getData } from '../../storageUtility';
import sd from '../../../utils/styleDictionary';
import { useNavigation } from '@react-navigation/native';

const AuditPatient = () => {
  const [userId, setUserId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterTimespan, setFilterTimespan] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigation = useNavigation();

  // Activity statistics
  const [stats, setStats] = useState({
    total: 0,
    login: 0,
    appointments: 0,
    other: 0,
  });

  const filterOptions = [
    { label: 'All Activities', value: 'all' },
    { label: 'Login Activities', value: 'login' },
    { label: 'Appointment Activities', value: 'appointment' },
    { label: 'Update Activities', value: 'update' },
  ];

  const timespanOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'week' },
    { label: 'Last 30 Days', value: 'month' },
  ];

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getData('userId');
        if (id) {
          setUserId(id);
        } else {
          console.log('User not found');
        }
      } catch (err) {
        console.log(err);
        setError('Error loading user data');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAuditData();
    }
  }, [userId]);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${ip.address}/api/patient/api/getaudit/${userId}`);
      const patientData = res.data.thePatient;
      setPatientData(patientData);
      
      // Calculate statistics
      if (patientData && patientData.audits) {
        const loginCount = patientData.audits.filter(audit => audit.action.toLowerCase().includes('login')).length;
        const appointmentCount = patientData.audits.filter(audit => 
          audit.action.toLowerCase().includes('appointment')).length;
        
        setStats({
          total: patientData.audits.length,
          login: loginCount,
          appointments: appointmentCount,
          other: patientData.audits.length - loginCount - appointmentCount
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching audit data:', err);
      setError(`Error fetching activity log: ${err.message}`);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAuditData();
    setRefreshing(false);
  };

  // Filter audits based on search term, selected filter, and timespan
  const getFilteredAudits = () => {
    if (!patientData || !patientData.audits) return [];

    let filtered = [...patientData.audits];

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

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return filtered;
  };
  
  // Get current page items for pagination
  const getCurrentItems = () => {
    const filteredItems = getFilteredAudits();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  };

  const getBadgeColor = (action) => {
    if (action.toLowerCase().includes('login')) {
      return sd.colors.green;
    } else if (action.toLowerCase().includes('appointment')) {
      return sd.colors.blue;
    } else if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('cancel')) {
      return sd.colors.red;
    }
    return sd.colors.primary;
  };

  const getIconName = (action) => {
    if (action.toLowerCase().includes('login')) {
      return 'shield-alt';
    } else if (action.toLowerCase().includes('appointment')) {
      return 'calendar-alt';
    } else if (action.toLowerCase().includes('delete') || action.toLowerCase().includes('cancel')) {
      return 'exclamation-triangle';
    }
    return 'history';
  };

  const renderAuditItem = ({ item }) => {
    const date = new Date(item.createdAt);
    const badgeColor = getBadgeColor(item.action);
    const iconName = getIconName(item.action);

    return (
      <Card style={styles.auditCard} mode="outlined">
        <Card.Content>
          <View style={styles.auditHeader}>
            <View style={[styles.badgeContainer, { backgroundColor: badgeColor }]}>
              <FontAwesome5 name={iconName} size={12} color="white" />
              <Text style={styles.badgeText}>{item.action}</Text>
            </View>
            <Text style={styles.dateText}>
              {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <Text style={styles.descriptionText}>{item.description}</Text>
          
          {item.ipAddress && (
            <Text style={styles.ipText}>IP: {item.ipAddress}</Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderStatCard = (title, count, icon, color) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statCardContent}>
        <View style={styles.statTextContainer}>
          <Text style={[styles.statTitle, { color }]}>{title}</Text>
          <Text style={styles.statCount}>{count}</Text>
        </View>
        <FontAwesome5 name={icon} size={20} color={color} />
      </Card.Content>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={sd.colors.blue} />
        <Text style={styles.loadingText}>Loading activity log...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={20} color={sd.colors.blue} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Activity Log</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={getCurrentItems()}
        keyExtractor={(item) => item._id}
        renderItem={renderAuditItem}
        ListHeaderComponent={
          <>
            <View style={styles.statsContainer}>
              {renderStatCard('Total Activities', stats.total, 'history', sd.colors.primary)}
              {renderStatCard('Login Activities', stats.login, 'shield-alt', sd.colors.green)}
              {renderStatCard('Appointment Activities', stats.appointments, 'calendar-alt', sd.colors.blue)}
              {renderStatCard('Other Activities', stats.other, 'filter', sd.colors.orange)}
            </View>

            <Card style={styles.filterCard}>
              <Card.Content>
                <Searchbar
                  placeholder="Search activities..."
                  onChangeText={setSearchTerm}
                  value={searchTerm}
                  style={styles.searchBar}
                  iconColor={sd.colors.blue}
                />

                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Filter by:</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={filterOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="All Activities"
                    value={selectedFilter}
                    onChange={item => {
                      setSelectedFilter(item.value);
                    }}
                    renderLeftIcon={() => (
                      <FontAwesome5 name="filter" size={16} color={sd.colors.blue} style={styles.dropdownIcon} />
                    )}
                  />
                </View>

                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Time period:</Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={timespanOptions}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder="All Time"
                    value={filterTimespan}
                    onChange={item => {
                      setFilterTimespan(item.value);
                    }}
                    renderLeftIcon={() => (
                      <FontAwesome5 name="calendar-alt" size={16} color={sd.colors.blue} style={styles.dropdownIcon} />
                    )}
                  />
                </View>
              </Card.Content>
            </Card>

            <Text style={styles.resultsText}>
              Showing {getCurrentItems().length} of {getFilteredAudits().length} activities
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="history" size={40} color={sd.colors.gray} />
            <Text style={styles.emptyText}>No activities found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[sd.colors.blue]} />
        }
        contentContainerStyle={styles.flatListContent}
      />

      {getFilteredAudits().length > itemsPerPage && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]} 
            onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FontAwesome5 name="chevron-left" size={16} color={currentPage === 1 ? sd.colors.gray : sd.colors.blue} />
          </TouchableOpacity>
          
          <Text style={styles.paginationText}>
            Page {currentPage} of {Math.ceil(getFilteredAudits().length / itemsPerPage)}
          </Text>
          
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage >= Math.ceil(getFilteredAudits().length / itemsPerPage) && styles.paginationButtonDisabled]} 
            onPress={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= Math.ceil(getFilteredAudits().length / itemsPerPage)}
          >
            <FontAwesome5 name="chevron-right" size={16} color={currentPage >= Math.ceil(getFilteredAudits().length / itemsPerPage) ? sd.colors.gray : sd.colors.blue} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e6f0',
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.bold,
    color: sd.colors.blue,
  },
  backButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: sd.colors.blue,
    fontFamily: sd.fonts.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    borderLeftWidth: 5,
    borderRadius: 8,
    elevation: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTextContainer: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statCount: {
    fontSize: 20,
    fontFamily: sd.fonts.bold,
    color: '#5a5c69',
  },
  filterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  searchBar: {
    marginBottom: 16,
    height: 40,
    backgroundColor: '#f8f9fc',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontFamily: sd.fonts.medium,
    marginBottom: 8,
    color: '#5a5c69',
  },
  dropdown: {
    height: 50,
    borderColor: '#e3e6f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: sd.fonts.regular,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#5a5c69',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  auditCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  auditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: sd.fonts.medium,
    marginLeft: 5,
  },
  dateText: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#5a5c69',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    marginBottom: 10,
    color: '#2e3141',
  },
  ipText: {
    fontSize: 12,
    fontFamily: sd.fonts.regular,
    color: '#858796',
  },
  flatListContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: sd.fonts.medium,
    color: sd.colors.gray,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e3e6f0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  paginationButton: {
    padding: 10,
    backgroundColor: '#f8f9fc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e3e6f0',
  },
  paginationButtonDisabled: {
    backgroundColor: '#f1f1f1',
    borderColor: '#e3e6f0',
  },
  paginationText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: sd.fonts.regular,
    color: '#5a5c69',
  },
});

export default AuditPatient;