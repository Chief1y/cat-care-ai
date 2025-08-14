import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CallRecord {
  id: string;
  patientName: string;
  petName: string;
  petType: string;
  callTime: string;
  duration: string;
  status: 'completed' | 'missed' | 'in-progress';
  urgency: 'low' | 'medium' | 'high';
}

const mockCalls: CallRecord[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    petName: 'Whiskers',
    petType: 'Cat',
    callTime: '2 hours ago',
    duration: '15 min',
    status: 'completed',
    urgency: 'medium'
  },
  {
    id: '2',
    patientName: 'Mike Chen',
    petName: 'Buddy',
    petType: 'Dog',
    callTime: '4 hours ago',
    duration: '8 min',
    status: 'completed',
    urgency: 'low'
  },
  {
    id: '3',
    patientName: 'Emily Rodriguez',
    petName: 'Luna',
    petType: 'Cat',
    callTime: '6 hours ago',
    duration: '22 min',
    status: 'completed',
    urgency: 'high'
  },
  {
    id: '4',
    patientName: 'David Wilson',
    petName: 'Max',
    petType: 'Dog',
    callTime: '8 hours ago',
    duration: '12 min',
    status: 'completed',
    urgency: 'medium'
  },
  {
    id: '5',
    patientName: 'Lisa Brown',
    petName: 'Mittens',
    petType: 'Cat',
    callTime: '1 day ago',
    duration: '18 min',
    status: 'completed',
    urgency: 'low'
  },
  {
    id: '6',
    patientName: 'Tom Davis',
    petName: 'Rocky',
    petType: 'Dog',
    callTime: '1 day ago',
    duration: '25 min',
    status: 'completed',
    urgency: 'high'
  },
  {
    id: '7',
    patientName: 'Anna Martinez',
    petName: 'Snowball',
    petType: 'Cat',
    callTime: '2 days ago',
    duration: '10 min',
    status: 'missed',
    urgency: 'medium'
  },
  {
    id: '8',
    patientName: 'James Taylor',
    petName: 'Cooper',
    petType: 'Dog',
    callTime: '2 days ago',
    duration: '16 min',
    status: 'completed',
    urgency: 'low'
  },
  {
    id: '9',
    patientName: 'Maria Garcia',
    petName: 'Shadow',
    petType: 'Cat',
    callTime: '3 days ago',
    duration: '20 min',
    status: 'completed',
    urgency: 'high'
  },
  {
    id: '10',
    patientName: 'John Smith',
    petName: 'Charlie',
    petType: 'Dog',
    callTime: '3 days ago',
    duration: '14 min',
    status: 'completed',
    urgency: 'medium'
  },
  {
    id: '11',
    patientName: 'Rachel Green',
    petName: 'Fluffy',
    petType: 'Cat',
    callTime: '4 days ago',
    duration: '11 min',
    status: 'completed',
    urgency: 'low'
  },
  {
    id: '12',
    patientName: 'Kevin Park',
    petName: 'Zeus',
    petType: 'Dog',
    callTime: '5 days ago',
    duration: '19 min',
    status: 'completed',
    urgency: 'medium'
  }
];

export default function RecentCallsScreen() {
  const { colors } = useTheme();

  const getStatusColor = (status: CallRecord['status']) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'missed': return '#FF6B6B';
      case 'in-progress': return '#FFA726';
      default: return colors.text;
    }
  };

  const getUrgencyColor = (urgency: CallRecord['urgency']): string => {
    switch (urgency) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA726';
      case 'low': return '#4CAF50';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: CallRecord['status']) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'missed': return 'close-circle';
      case 'in-progress': return 'time';
      default: return 'radio-button-off';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="call" size={32} color={colors.accent as string} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Recent Calls</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text }]}>
            Your consultation history
          </Text>
        </View>

        {/* Calls List */}
        <View style={styles.callsList}>
          {mockCalls.map((call) => (
            <TouchableOpacity
              key={call.id}
              style={[styles.callCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.callHeader}>
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>
                    {call.patientName}
                  </Text>
                  <View style={styles.petInfo}>
                    <Ionicons 
                      name={call.petType === 'Cat' ? 'paw' : 'paw'} 
                      size={14} 
                      color={colors.accent as string} 
                    />
                    <Text style={[styles.petName, { color: colors.accent }]}>
                      {call.petName} ({call.petType})
                    </Text>
                  </View>
                </View>
                <View style={styles.callStatus}>
                  <Ionicons 
                    name={getStatusIcon(call.status) as any} 
                    size={20} 
                    color={getStatusColor(call.status)} 
                  />
                </View>
              </View>

              <View style={styles.callDetails}>
                <View style={styles.timeInfo}>
                  <Ionicons name="time-outline" size={14} color={colors.text as string} />
                  <Text style={[styles.callTime, { color: colors.text }]}>
                    {call.callTime} • {call.duration}
                  </Text>
                </View>
                <View style={[styles.urgencyBadge, { backgroundColor: `${getUrgencyColor(call.urgency)}20` }]}>
                  <Text style={[styles.urgencyText, { color: getUrgencyColor(call.urgency) }]}>
                    {call.urgency.toUpperCase()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Footer */}
        <View style={[styles.statsFooter, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Total Calls</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>11</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>16m</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Avg Duration</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  callsList: {
    gap: 12,
  },
  callCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  petName: {
    fontSize: 14,
    fontWeight: '500',
  },
  callStatus: {
    marginLeft: 12,
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statsFooter: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});
