import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { Check, Circle, Bell, AlertCircle, Camera } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { Season } from '@/constants/types';
import { useApp } from '@/contexts/AppContext';
import { mockReminders } from '@/mocks/data';

const SEASONS: { key: Season; label: string }[] = [
  { key: 'winter', label: 'Winter' },
  { key: 'spring', label: 'Spring' },
  { key: 'summer', label: 'Summer' },
  { key: 'fall', label: 'Fall' },
];

export default function TasksScreen() {
  const { checklists, toggleChecklistItem, reminders: storedReminders } = useApp();
  const [activeTab, setActiveTab] = useState<'checklists' | 'reminders'>('checklists');
  const [activeSeason, setActiveSeason] = useState<Season>('winter');
  const [showReportIssue, setShowReportIssue] = useState(false);

  const reminders = storedReminders.length > 0 ? storedReminders : mockReminders;
  const currentChecklist = checklists[activeSeason];
  const completedCount = currentChecklist.filter(item => item.completed).length;
  const totalCount = currentChecklist.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'filter':
        return <AlertCircle size={20} color={Colors.warning} />;
      case 'checkup':
        return <Bell size={20} color={Colors.info} />;
      case 'seasonal':
        return <AlertCircle size={20} color={Colors.primary} />;
      default:
        return <Bell size={20} color={Colors.textSecondary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Tasks & Reminders',
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'checklists' && styles.activeTab]}
          onPress={() => setActiveTab('checklists')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'checklists' && styles.activeTabText]}>
            Seasonal Checklists
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reminders' && styles.activeTab]}
          onPress={() => setActiveTab('reminders')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'reminders' && styles.activeTabText]}>
            Reminders
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'checklists' ? (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.seasonSelector}>
            {SEASONS.map((season) => (
              <TouchableOpacity
                key={season.key}
                style={[
                  styles.seasonButton,
                  activeSeason === season.key && styles.activeSeasonButton,
                ]}
                onPress={() => setActiveSeason(season.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.seasonButtonText,
                    activeSeason === season.key && styles.activeSeasonButtonText,
                  ]}
                >
                  {season.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress</Text>
              <Text style={styles.progressCount}>
                {completedCount} / {totalCount}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]} 
              />
            </View>
          </View>

          <View style={styles.checklistContainer}>
            {currentChecklist.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklistItem(activeSeason, item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.checkboxContainer}>
                  {item.completed ? (
                    <View style={styles.checkboxChecked}>
                      <Check size={16} color={Colors.surface} />
                    </View>
                  ) : (
                    <Circle size={24} color={Colors.border} strokeWidth={2} />
                  )}
                </View>
                <Text
                  style={[
                    styles.checklistText,
                    item.completed && styles.checklistTextCompleted,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!showReportIssue ? (
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => setShowReportIssue(true)}
              activeOpacity={0.7}
            >
              <AlertCircle size={20} color={Colors.primary} />
              <Text style={styles.reportButtonText}>Noticed a problem?</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Report an Issue</Text>
              <TextInput
                style={styles.reportInput}
                placeholder="Describe the problem..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.photoButton} activeOpacity={0.7}>
                <Camera size={20} color={Colors.primary} />
                <Text style={styles.photoButtonText}>Add Photos</Text>
              </TouchableOpacity>
              <View style={styles.reportActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowReportIssue(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} activeOpacity={0.7}>
                  <Text style={styles.submitButtonText}>Send to NE Building Performance</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Bell size={48} color={Colors.textLight} />
              <Text style={styles.emptyStateText}>No reminders yet</Text>
            </View>
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderHeader}>
                  {getReminderIcon(reminder.type)}
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderDescription}>{reminder.description}</Text>
                  </View>
                </View>
                <View style={styles.reminderFooter}>
                  <Text style={styles.reminderDate}>{formatDate(reminder.dueDate)}</Text>
                  <TouchableOpacity style={styles.markDoneButton} activeOpacity={0.7}>
                    <Text style={styles.markDoneText}>Mark Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center' as const,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  seasonSelector: {
    flexDirection: 'row' as const,
    gap: 8,
    marginBottom: 20,
  },
  seasonButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeSeasonButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  seasonButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  activeSeasonButtonText: {
    color: Colors.surface,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  progressHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  checklistContainer: {
    marginBottom: 20,
  },
  checklistItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      } as any,
    }),
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  checklistTextCompleted: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through' as const,
  },
  reportButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed' as const,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  reportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      } as any,
    }),
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  reportInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 12,
    minHeight: 100,
  },
  photoButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  reportActions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center' as const,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
  reminderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  reminderHeader: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  reminderFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  reminderDate: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  markDoneButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary + '20',
  },
  markDoneText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 16,
  },
});
