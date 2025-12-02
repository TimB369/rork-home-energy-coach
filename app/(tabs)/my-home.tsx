import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';

import { Home as HomeIcon, Calendar, DollarSign, Fuel, ChevronRight, FileText, Image as ImageIcon, Award } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { mockHomeProfile, mockWorkHistory, mockRecommendations, mockDocuments } from '@/mocks/data';

export default function MyHomeScreen() {
  const [activeTab, setActiveTab] = useState<'profile' | 'upgrades'>('profile');

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const getBenefitColor = (benefit: string): string => {
    switch (benefit) {
      case 'comfort':
        return Colors.primary;
      case 'savings':
        return Colors.success;
      case 'health':
        return Colors.info;
      case 'moisture':
        return Colors.warning;
      case 'ice-dams':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'My Home',
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile & History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upgrades' && styles.activeTab]}
          onPress={() => setActiveTab('upgrades')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'upgrades' && styles.activeTabText]}>
            Recommended Upgrades
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'profile' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Home Information</Text>
              
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <HomeIcon size={20} color={Colors.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoValue}>{mockHomeProfile.address}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Calendar size={18} color={Colors.textSecondary} />
                    <View>
                      <Text style={styles.infoLabel}>Built</Text>
                      <Text style={styles.infoValue}>{mockHomeProfile.yearBuilt}</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <HomeIcon size={18} color={Colors.textSecondary} />
                    <View>
                      <Text style={styles.infoLabel}>Square Footage</Text>
                      <Text style={styles.infoValue}>{mockHomeProfile.squareFootage.toLocaleString()} sq ft</Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <Fuel size={18} color={Colors.textSecondary} />
                    <View>
                      <Text style={styles.infoLabel}>Fuel Type</Text>
                      <Text style={styles.infoValue}>{mockHomeProfile.fuelType}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work History</Text>
              
              {mockWorkHistory.map((item, index) => (
                <View key={item.id} style={styles.workCard}>
                  <View style={styles.workHeader}>
                    <View style={styles.workTitleRow}>
                      <Text style={styles.workTitle}>{item.title}</Text>
                      {item.warranty && (
                        <View style={styles.warrantyBadge}>
                          <Award size={12} color={Colors.success} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.workDate}>{formatDate(item.date)}</Text>
                  </View>
                  
                  <Text style={styles.workDescription}>{item.description}</Text>
                  
                  <View style={styles.savingsRow}>
                    <DollarSign size={16} color={Colors.success} />
                    <Text style={styles.savingsText}>
                      Est. ${item.estimatedSavings}/year in savings
                    </Text>
                  </View>

                  {item.warranty && (
                    <View style={styles.warrantyInfo}>
                      <Text style={styles.warrantyText}>
                        Warranty: {item.warranty.length} (expires {formatDate(item.warranty.expirationDate)})
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Documents</Text>
              
              {mockDocuments.map((doc) => (
                <TouchableOpacity key={doc.id} style={styles.documentCard} activeOpacity={0.7}>
                  <View style={styles.documentIcon}>
                    {doc.type === 'pdf' ? (
                      <FileText size={24} color={Colors.primary} />
                    ) : (
                      <ImageIcon size={24} color={Colors.primary} />
                    )}
                  </View>
                  
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                    <Text style={styles.documentDate}>{formatDate(doc.date)}</Text>
                  </View>
                  
                  <ChevronRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phase 2 – Recommended</Text>
              <Text style={styles.sectionSubtitle}>
                Next steps to improve comfort and efficiency
              </Text>

              {mockRecommendations
                .filter(rec => rec.phase === 2)
                .map((rec) => (
                  <View key={rec.id} style={styles.upgradeCard}>
                    <View style={styles.upgradeHeader}>
                      <Text style={styles.upgradeTitle}>{rec.title}</Text>
                      <View style={[styles.priorityBadge, { backgroundColor: rec.priority === 'high' ? Colors.error + '20' : Colors.warning + '20' }]}>
                        <Text style={[styles.priorityText, { color: rec.priority === 'high' ? Colors.error : Colors.warning }]}>
                          {rec.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.upgradeDescription}>{rec.description}</Text>

                    <View style={styles.benefitContainer}>
                      {rec.benefits.map((benefit, idx) => (
                        <View key={idx} style={[styles.benefitTag, { borderColor: getBenefitColor(benefit) }]}>
                          <Text style={[styles.benefitText, { color: getBenefitColor(benefit) }]}>
                            {benefit}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.upgradeFooter}>
                      <Text style={styles.costRange}>{rec.costRange}</Text>
                      <TouchableOpacity style={styles.estimateButton} activeOpacity={0.7}>
                        <Text style={styles.estimateButtonText}>Request Estimate</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phase 3 – Long-Term</Text>
              <Text style={styles.sectionSubtitle}>
                Optional upgrades for maximum efficiency
              </Text>

              {mockRecommendations
                .filter(rec => rec.phase === 3)
                .map((rec) => (
                  <View key={rec.id} style={styles.upgradeCard}>
                    <View style={styles.upgradeHeader}>
                      <Text style={styles.upgradeTitle}>{rec.title}</Text>
                    </View>

                    <Text style={styles.upgradeDescription}>{rec.description}</Text>

                    <View style={styles.benefitContainer}>
                      {rec.benefits.map((benefit, idx) => (
                        <View key={idx} style={[styles.benefitTag, { borderColor: getBenefitColor(benefit) }]}>
                          <Text style={[styles.benefitText, { color: getBenefitColor(benefit) }]}>
                            {benefit}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.upgradeFooter}>
                      <Text style={styles.costRange}>{rec.costRange}</Text>
                      <TouchableOpacity style={styles.estimateButton} activeOpacity={0.7}>
                        <Text style={styles.estimateButtonText}>Request Estimate</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </>
        )}
      </ScrollView>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  infoCard: {
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
  infoRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
    minWidth: '45%',
  },
  workCard: {
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
  workHeader: {
    marginBottom: 8,
  },
  workTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 4,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  warrantyBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  workDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  workDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  savingsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  warrantyInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  warrantyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  documentCard: {
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
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  upgradeCard: {
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
  upgradeHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  upgradeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  benefitContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginBottom: 12,
  },
  benefitTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  benefitText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  upgradeFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  costRange: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  estimateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  estimateButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
});
