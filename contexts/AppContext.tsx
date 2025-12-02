import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChecklistItem, Season, Reminder } from '@/constants/types';
import { getSeasonalChecklist } from '@/mocks/data';
import { trpcClient } from '@/lib/trpc';

type AppState = {
  checklists: Record<Season, ChecklistItem[]>;
  reminders: Reminder[];
  referralCode: string;
  toggleChecklistItem: (season: Season, itemId: string) => void;
  toggleReminder: (reminderId: string) => void;
  reportIssue: (description: string, photos: string[]) => Promise<void>;
  submitServiceRequest: (type: string, data: any) => Promise<void>;
  submitReview: (rating: number, feedback?: string) => Promise<void>;
  isLoading: boolean;
};

export const [AppProvider, useApp] = createContextHook<AppState>(() => {
  const [checklists, setChecklists] = useState<Record<Season, ChecklistItem[]>>({
    winter: getSeasonalChecklist('winter'),
    spring: getSeasonalChecklist('spring'),
    summer: getSeasonalChecklist('summer'),
    fall: getSeasonalChecklist('fall'),
  });

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [referralCode] = useState('JOHNSON2026');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedChecklists = await AsyncStorage.getItem('checklists');
      const storedReminders = await AsyncStorage.getItem('reminders');

      if (storedChecklists) {
        setChecklists(JSON.parse(storedChecklists));
      }

      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChecklistItem = async (season: Season, itemId: string) => {
    const updatedChecklists = {
      ...checklists,
      [season]: checklists[season].map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    };
    
    setChecklists(updatedChecklists);
    
    try {
      await AsyncStorage.setItem('checklists', JSON.stringify(updatedChecklists));
    } catch (error) {
      console.log('Error saving checklist:', error);
    }
  };

  const toggleReminder = async (reminderId: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, completed: !reminder.completed } : reminder
    );
    
    setReminders(updatedReminders);
    
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.log('Error saving reminders:', error);
    }
  };

  const reportIssue = async (description: string, photos: string[]) => {
    console.log('Reporting issue:', description, photos);
    try {
      const result = await trpcClient.services.submit.mutate({
        serviceType: 'issue',
        name: 'Customer',
        phone: '',
        email: '',
        notes: description,
        photoCount: photos.length,
      });
      console.log('Issue reported:', result);
    } catch (error) {
      console.error('Error reporting issue:', error);
    }
  };

  const submitServiceRequest = async (type: string, data: any) => {
    console.log('Service request submitted:', type, data);
    try {
      const result = await trpcClient.services.submit.mutate({
        serviceType: type as 'audit' | 'insulation' | 'issue',
        ...data,
      });
      console.log('Service request result:', result);
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  const submitReview = async (rating: number, feedback?: string) => {
    console.log('Review submitted:', rating, feedback);
    try {
      const result = await trpcClient.services.review.mutate({
        rating,
        feedback,
      });
      console.log('Review result:', result);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return {
    checklists,
    reminders,
    referralCode,
    toggleChecklistItem,
    toggleReminder,
    reportIssue,
    submitServiceRequest,
    submitReview,
    isLoading,
  };
});
