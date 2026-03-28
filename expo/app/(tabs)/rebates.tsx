import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Home, Wind, Zap, Droplets, ExternalLink, ChevronRight } from 'lucide-react-native';

import Colors from '@/constants/colors';

type RebateCategory = 'heating-cooling' | 'insulation' | 'weatherization' | 'appliances' | 'other';

type Rebate = {
  id: string;
  title: string;
  category: RebateCategory;
  amount: string;
  description: string;
  eligibility: string;
  link: string;
};

const MASS_SAVE_REBATES: Rebate[] = [
  {
    id: '1',
    title: 'Heat Pump Water Heater',
    category: 'heating-cooling',
    amount: 'Up to $1,500',
    description: 'Rebate for installing an ENERGY STAR certified heat pump water heater.',
    eligibility: 'Available for electric customers. Must meet ENERGY STAR requirements.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '2',
    title: 'Ductless Mini-Split Heat Pump',
    category: 'heating-cooling',
    amount: 'Up to $1,250 per outdoor unit',
    description: 'Rebate for installing ENERGY STAR certified ductless mini-split heat pumps.',
    eligibility: 'Available for electric customers. Must be installed by qualified contractor.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '3',
    title: 'Central Air Source Heat Pump',
    category: 'heating-cooling',
    amount: 'Up to $1,500',
    description: 'Rebate for installing central air source heat pumps that replace electric resistance heating.',
    eligibility: 'Must replace electric resistance heating system.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '4',
    title: 'Attic/Roof Insulation',
    category: 'insulation',
    amount: '75% of cost, up to $2,000',
    description: 'Insulation rebate for attic or roof insulation improvements.',
    eligibility: 'Must have completed a Mass Save Home Energy Assessment.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '5',
    title: 'Wall Insulation',
    category: 'insulation',
    amount: '75% of cost, up to $2,000',
    description: 'Rebate for wall insulation in existing homes.',
    eligibility: 'Must have completed a Mass Save Home Energy Assessment.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '6',
    title: 'Basement/Crawlspace Insulation',
    category: 'insulation',
    amount: '75% of cost, up to $2,000',
    description: 'Rebate for basement or crawlspace insulation.',
    eligibility: 'Must have completed a Mass Save Home Energy Assessment.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '7',
    title: 'Air Sealing',
    category: 'weatherization',
    amount: '75% of cost, up to $2,000',
    description: 'Rebate for professional air sealing to reduce drafts and energy loss.',
    eligibility: 'Must have completed a Mass Save Home Energy Assessment.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '8',
    title: 'Smart Thermostat',
    category: 'appliances',
    amount: 'Up to $100',
    description: 'Rebate for ENERGY STAR certified smart thermostats.',
    eligibility: 'Available for electric and gas customers.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '9',
    title: 'Heat Pump Clothes Dryer',
    category: 'appliances',
    amount: 'Up to $500',
    description: 'Rebate for ENERGY STAR certified heat pump clothes dryers.',
    eligibility: 'Available for electric customers.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
  {
    id: '10',
    title: 'Energy-Efficient Windows',
    category: 'weatherization',
    amount: 'Up to $15-25 per sq. ft.',
    description: 'Rebate for ENERGY STAR certified replacement windows.',
    eligibility: 'Must meet ENERGY STAR requirements. Limited availability.',
    link: 'https://www.masssave.com/residential/rebates-and-incentives'
  },
];

const CATEGORY_CONFIG: Record<RebateCategory, { icon: React.ElementType; label: string; color: string }> = {
  'heating-cooling': { icon: Wind, label: 'Heating & Cooling', color: '#48A868' },
  'insulation': { icon: Home, label: 'Insulation', color: '#f38329' },
  'weatherization': { icon: Droplets, label: 'Weatherization', color: '#2c3646' },
  'appliances': { icon: Zap, label: 'Appliances', color: '#c7c7c7' },
  'other': { icon: DollarSign, label: 'Other', color: '#6B7280' },
};

export default function RebatesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<RebateCategory | 'all'>('all');
  const [expandedRebate, setExpandedRebate] = useState<string | null>(null);

  const filteredRebates = selectedCategory === 'all' 
    ? MASS_SAVE_REBATES 
    : MASS_SAVE_REBATES.filter(r => r.category === selectedCategory);

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  const toggleRebate = (id: string) => {
    setExpandedRebate(expandedRebate === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Mass Save Rebates</Text>
          <Text style={styles.subtitle}>Current incentives & programs</Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = selectedCategory === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedCategory(key as RebateCategory)}
              activeOpacity={0.7}
            >
              <Icon size={16} color={isActive ? Colors.surface : Colors.textSecondary} />
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            <DollarSign size={24} color={Colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Save More on Your Next Upgrade</Text>
            <Text style={styles.infoText}>
              Mass Save offers rebates and incentives to help make energy efficiency upgrades more affordable. Many programs require a Home Energy Assessment first.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          {filteredRebates.length} {selectedCategory === 'all' ? 'Available' : CATEGORY_CONFIG[selectedCategory as RebateCategory]?.label || ''} Rebates
        </Text>

        {filteredRebates.map((rebate) => {
          const config = CATEGORY_CONFIG[rebate.category];
          const Icon = config.icon;
          const isExpanded = expandedRebate === rebate.id;

          return (
            <View key={rebate.id} style={styles.rebateCard}>
              <TouchableOpacity
                onPress={() => toggleRebate(rebate.id)}
                activeOpacity={0.7}
              >
                <View style={styles.rebateHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: config.color + '15' }]}>
                    <Icon size={16} color={config.color} />
                  </View>
                  <View style={styles.rebateInfo}>
                    <Text style={styles.rebateTitle}>{rebate.title}</Text>
                    <Text style={styles.rebateAmount}>{rebate.amount}</Text>
                  </View>
                  <ChevronRight 
                    size={20} 
                    color={Colors.textSecondary}
                    style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.rebateDetails}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailText}>{rebate.description}</Text>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Eligibility</Text>
                    <Text style={styles.detailText}>{rebate.eligibility}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.learnMoreButton}
                    onPress={() => handleOpenLink(rebate.link)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.learnMoreText}>Learn More on Mass Save</Text>
                    <ExternalLink size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Need Help Getting Started?</Text>
          <Text style={styles.footerText}>
            Contact NE Building Performance to schedule a Mass Save Home Energy Assessment and learn which rebates apply to your home.
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.7}
          >
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    backgroundColor: Colors.secondary,
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.surface,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterScroll: {
    backgroundColor: Colors.background,
    maxHeight: 60,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row' as const,
    gap: 16,
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
  infoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  rebateCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden' as const,
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
  rebateHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    gap: 12,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  rebateInfo: {
    flex: 1,
  },
  rebateTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  rebateAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  rebateDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  learnMoreButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary + '10',
    gap: 8,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  footerCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 24,
    marginTop: 12,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.surface,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center' as const,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
});
