import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Share, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Wrench, Star, Users, ChevronRight, Send } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

type ServiceType = 'audit' | 'insulation' | 'issue' | null;

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  home_type: string;
  main_issue: string;
  contact_time: string;
}

export default function ServicesScreen() {
  const { referralCode, submitReview } = useApp();
  const [activeScreen, setActiveScreen] = useState<'menu' | 'service-request' | 'review' | 'referral'>('menu');
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    home_type: '',
    main_issue: '',
    contact_time: '',
  });

  const handleServiceRequest = (type: ServiceType) => {
    setSelectedService(type);
    setActiveScreen('service-request');
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `I just had great work done by NE Building Performance! Use my referral code ${referralCode} for a reward on your next service. Contact them for a free energy audit!`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleReviewSubmit = () => {
    submitReview(rating, feedback);
    setRating(0);
    setFeedback('');
    setActiveScreen('menu');
  };

  const renderMenu = () => (
    <ScrollView 
      style={styles.content}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request Services</Text>
        
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleServiceRequest('audit')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Wrench size={24} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Book an Energy Audit</Text>
            <Text style={styles.menuDescription}>
              Get a comprehensive assessment of your home&apos;s efficiency
            </Text>
          </View>
          <ChevronRight size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleServiceRequest('insulation')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Wrench size={24} color={Colors.primary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Request Insulation / Air Sealing</Text>
            <Text style={styles.menuDescription}>
              Improve comfort and reduce energy costs
            </Text>
          </View>
          <ChevronRight size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleServiceRequest('issue')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Wrench size={24} color={Colors.warning} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Report a Comfort Issue</Text>
            <Text style={styles.menuDescription}>
              Let us know about drafts, cold spots, or other concerns
            </Text>
          </View>
          <ChevronRight size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback & Referrals</Text>
        
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => setActiveScreen('review')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Star size={24} color={Colors.accent} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Leave a Review</Text>
            <Text style={styles.menuDescription}>
              Share your experience with our work
            </Text>
          </View>
          <ChevronRight size={24} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => setActiveScreen('referral')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconContainer}>
            <Users size={24} color={Colors.secondary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Refer a Friend</Text>
            <Text style={styles.menuDescription}>
              You both get a reward on your next service
            </Text>
          </View>
          <ChevronRight size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Required Field', 'Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Required Field', 'Please enter your phone number');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Required Field', 'Please enter your email');
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert('Required Field', 'Please enter your address');
      return;
    }
    if (!formData.home_type) {
      Alert.alert('Required Field', 'Please select your home type');
      return;
    }
    if (!formData.main_issue) {
      Alert.alert('Required Field', 'Please select the main issue');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'https://rork.app/p/fk1n8ph6aajjh30ipabh1';
      const response = await fetch(`${apiUrl}/api/service-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          home_type: formData.home_type,
          main_issue: formData.main_issue,
          contact_time: formData.contact_time,
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Success!',
          'Your service request has been submitted. We\'ll contact you soon!',
          [{
            text: 'OK',
            onPress: () => {
              setActiveScreen('menu');
              setSelectedService(null);
              setFormData({
                name: '',
                phone: '',
                email: '',
                address: '',
                home_type: '',
                main_issue: '',
                contact_time: '',
              });
            },
          }]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert(
          'Error',
          errorData.message || 'Failed to submit request. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert(
        'Error',
        'Failed to submit request. Please check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderServiceRequest = () => {
    let title = 'Request Service';
    let description = '';
    
    if (selectedService === 'audit') {
      title = 'Book an Energy Audit';
      description = 'Schedule a comprehensive energy assessment';
    } else if (selectedService === 'insulation') {
      title = 'Request Insulation / Air Sealing';
      description = 'Get an estimate for improving your home\'s efficiency';
    } else if (selectedService === 'issue') {
      title = 'Report a Comfort Issue';
      description = 'Describe the problem you\'re experiencing';
    }

    const homeTypes = ['Single Family', 'Multi-Family', 'Condo', 'Apartment'];
    const mainIssues = ['High energy bills', 'Drafty rooms', 'Ice dams', 'Comfort issues', 'Other'];

    return (
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{title}</Text>
          <Text style={styles.formDescription}>{description}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Your name"
              placeholderTextColor={Colors.textLight}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Phone *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="(555) 123-4567"
              placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Address *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="123 Main St, City, State"
              placeholderTextColor={Colors.textLight}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Home Type *</Text>
            <View style={styles.pickerContainer}>
              {homeTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    formData.home_type === type && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, home_type: type })}
                  activeOpacity={0.7}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      formData.home_type === type && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Main Issue *</Text>
            <View style={styles.pickerContainer}>
              {mainIssues.map((issue) => (
                <TouchableOpacity
                  key={issue}
                  style={[
                    styles.pickerOption,
                    formData.main_issue === issue && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, main_issue: issue })}
                  activeOpacity={0.7}
                  disabled={isSubmitting}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      formData.main_issue === issue && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {issue}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Preferred Contact Time</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g., Weekday mornings, After 5pm"
              placeholderTextColor={Colors.textLight}
              value={formData.contact_time}
              onChangeText={(text) => setFormData({ ...formData, contact_time: text })}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButtonLarge}
              onPress={() => {
                setActiveScreen('menu');
                setSelectedService(null);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  home_type: '',
                  main_issue: '',
                  contact_time: '',
                });
              }}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonTextLarge}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButtonLarge, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleFormSubmit}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.surface} />
              ) : (
                <>
                  <Send size={18} color={Colors.surface} />
                  <Text style={styles.submitButtonTextLarge}>Submit Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderReview = () => {
    const showGoogleReview = rating >= 4;

    return (
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>How did we do?</Text>
          <Text style={styles.formDescription}>
            Your feedback helps us improve our service
          </Text>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Star
                  size={48}
                  color={star <= rating ? Colors.accent : Colors.border}
                  fill={star <= rating ? Colors.accent : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <>
              {showGoogleReview ? (
                <View style={styles.googleReviewCard}>
                  <Text style={styles.googleReviewTitle}>🎉 Thank you!</Text>
                  <Text style={styles.googleReviewText}>
                    We&apos;re thrilled you had a great experience! Would you mind sharing your feedback on Google?
                  </Text>
                  <TouchableOpacity
                    style={styles.googleReviewButton}
                    activeOpacity={0.7}
                    onPress={handleReviewSubmit}
                  >
                    <Text style={styles.googleReviewButtonText}>Leave a Google Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setRating(0);
                      setActiveScreen('menu');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.skipText}>Maybe later</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>What can we improve?</Text>
                    <TextInput
                      style={[styles.formInput, styles.formTextArea]}
                      placeholder="Please tell us what went wrong so we can make it right..."
                      placeholderTextColor={Colors.textLight}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={feedback}
                      onChangeText={setFeedback}
                    />
                  </View>

                  <View style={styles.formActions}>
                    <TouchableOpacity
                      style={styles.cancelButtonLarge}
                      onPress={() => {
                        setRating(0);
                        setFeedback('');
                        setActiveScreen('menu');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonTextLarge}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButtonLarge}
                      onPress={handleReviewSubmit}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.submitButtonTextLarge}>Submit Feedback</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderReferral = () => (
    <ScrollView 
      style={styles.content}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.formCard}>
        <View style={styles.referralHeader}>
          <Users size={48} color={Colors.secondary} />
          <Text style={styles.formTitle}>Refer a Friend</Text>
          <Text style={styles.formDescription}>
            Share the benefits of energy efficiency! You both get a reward on your next service.
          </Text>
        </View>

        <View style={styles.referralCodeCard}>
          <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <Text style={styles.referralCodeHint}>
            Share this code with friends and family
          </Text>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareReferral}
          activeOpacity={0.7}
        >
          <Send size={20} color={Colors.surface} />
          <Text style={styles.shareButtonText}>Share via Text or Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveScreen('menu')}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Back to Services</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: activeScreen === 'menu' ? 'Services' : 
                 activeScreen === 'service-request' ? 'Request Service' :
                 activeScreen === 'review' ? 'Leave a Review' : 'Refer a Friend',
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
          headerLeft: activeScreen !== 'menu' ? () => (
            <TouchableOpacity 
              onPress={() => {
                setActiveScreen('menu');
                setSelectedService(null);
                setRating(0);
                setFeedback('');
              }}
              style={{ marginLeft: -8 }}
            >
              <Text style={{ color: Colors.primary, fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
          ) : undefined,
        }} 
      />

      {activeScreen === 'menu' && renderMenu()}
      {activeScreen === 'service-request' && renderServiceRequest()}
      {activeScreen === 'review' && renderReview()}
      {activeScreen === 'referral' && renderReferral()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  menuCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
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
  formTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTextArea: {
    minHeight: 100,
    textAlignVertical: 'top' as const,
  },
  photoUploadButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed' as const,
    marginBottom: 24,
  },
  photoUploadText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  formActions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  cancelButtonLarge: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center' as const,
  },
  cancelButtonTextLarge: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  submitButtonLarge: {
    flex: 2,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  submitButtonTextLarge: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
  ratingContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginBottom: 24,
  },
  googleReviewCard: {
    alignItems: 'center' as const,
  },
  googleReviewTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  googleReviewText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 24,
  },
  googleReviewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 16,
  },
  googleReviewButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  referralHeader: {
    alignItems: 'center' as const,
    marginBottom: 24,
  },
  referralCodeCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center' as const,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  referralCodeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  referralCode: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.secondary,
    letterSpacing: 2,
    marginBottom: 8,
  },
  referralCodeHint: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 16,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
  backButton: {
    alignItems: 'center' as const,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  pickerContainer: {
    gap: 8,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  pickerOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  pickerOptionText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  pickerOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
