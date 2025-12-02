import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Gauge, Briefcase, ChevronRight, CheckCircle, Calendar, Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';



export default function HomeScreen() {
  const [showBackendTest, setShowBackendTest] = useState(false);
  
  const profileQuery = trpc.home.profile.useQuery(undefined, {
    retry: 2,
    retryDelay: 2000,
    staleTime: 1000 * 60 * 5,
  });
  const workHistoryQuery = trpc.work.history.useQuery(undefined, {
    retry: 2,
    retryDelay: 2000,
    staleTime: 1000 * 60 * 5,
  });
  const testQuery = trpc.example.hi.useQuery(undefined, {
    enabled: showBackendTest,
    retry: 2,
    retryDelay: 2000,
  });

  React.useEffect(() => {
    if (profileQuery.error) {
      console.error('[Home] Profile query error:', profileQuery.error);
    }
    if (workHistoryQuery.error) {
      console.error('[Home] Work history error:', workHistoryQuery.error);
    }
  }, [profileQuery.error, workHistoryQuery.error]);
  
  const fallbackProfile = {
    customerName: 'Mr. & Mrs. Johnson',
    address: '123 Maple Street, Manchester, NH 03101',
    yearBuilt: 1985,
    squareFootage: 2400,
    fuelType: 'Natural Gas',
    totalAnnualSavings: 1850,
    comfortScore: 8.5,
  };

  const fallbackWorkHistory = [
    {
      id: '1',
      title: 'Attic Insulation & Air Sealing',
      date: '2024-03-15',
      description: 'Upgraded attic insulation from R-19 to R-60. Sealed air leaks around chimney, wiring penetrations, and top plates.',
      estimatedSavings: 850,
      warranty: { length: 'Lifetime', expirationDate: '2099-12-31' },
    },
  ];

  const mockHomeProfile = profileQuery.data || fallbackProfile;
  const mockWorkHistory = workHistoryQuery.data || fallbackWorkHistory;

  const getComfortColor = (score: number): string => {
    if (score >= 8) return Colors.comfort.high;
    if (score >= 5) return Colors.comfort.medium;
    return Colors.comfort.low;
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const latestWork = mockWorkHistory[0] || null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.secondary, '#1f2631']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{mockHomeProfile.customerName}</Text>
            </View>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/299y1n8syrd2sra9kfkbr' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.backendTestCard}
          activeOpacity={0.7}
          onPress={() => setShowBackendTest(!showBackendTest)}
        >
          <View style={styles.backendHeader}>
            <View style={styles.backendIconRow}>
              {testQuery.isLoading ? (
                <RefreshCw size={20} color={Colors.textSecondary} />
              ) : testQuery.isSuccess ? (
                <Wifi size={20} color={Colors.success} />
              ) : (
                <WifiOff size={20} color={Colors.textSecondary} />
              )}
              <Text style={styles.backendTitle}>tRPC Connection Test</Text>
            </View>
            <Text style={styles.backendToggle}>{showBackendTest ? '▼' : '▶'}</Text>
          </View>
          {showBackendTest && (
            <View style={styles.backendContent}>
              {testQuery.isLoading && (
                <Text style={styles.backendText}>Loading...</Text>
              )}
              {testQuery.isSuccess && testQuery.data && (
                <View>
                  <Text style={styles.backendStatus}>✅ tRPC Connected</Text>
                  <Text style={styles.backendText}>Message: {testQuery.data.message}</Text>
                  <Text style={styles.backendText}>Time: {new Date(testQuery.data.timestamp).toLocaleTimeString()}</Text>
                </View>
              )}
              {testQuery.isError && (
                <View>
                  <Text style={styles.backendStatus}>❌ Error</Text>
                  <Text style={styles.backendText}>{String(testQuery.error)}</Text>
                </View>
              )}
              {!testQuery.isLoading && !testQuery.isSuccess && !testQuery.isError && (
                <Text style={styles.backendText}>Tap to test tRPC connection</Text>
              )}
              {(testQuery.isSuccess || testQuery.isError) && (
                <TouchableOpacity
                  style={styles.refetchButton}
                  onPress={() => testQuery.refetch()}
                >
                  <Text style={styles.refetchText}>Test Again</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.savingsCard]}>
            <View style={styles.iconCircle}>
              <TrendingUp size={24} color={Colors.success} />
            </View>
            <Text style={styles.summaryLabel}>Annual Savings</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(mockHomeProfile.totalAnnualSavings)}
            </Text>
            <Text style={styles.summarySubtext}>Estimated yearly</Text>
          </View>

          <View style={[styles.summaryCard, styles.comfortCard]}>
            <View style={styles.iconCircle}>
              <Gauge size={24} color={getComfortColor(mockHomeProfile.comfortScore)} />
            </View>
            <Text style={styles.summaryLabel}>Comfort Level</Text>
            <View style={styles.comfortRow}>
              <Text style={styles.summaryValue}>{mockHomeProfile.comfortScore}</Text>
              <Text style={styles.comfortMax}>/10</Text>
            </View>
            <View style={[styles.comfortBar, { backgroundColor: Colors.divider }]}>
              <View 
                style={[
                  styles.comfortBarFill, 
                  { 
                    width: `${mockHomeProfile.comfortScore * 10}%`,
                    backgroundColor: getComfortColor(mockHomeProfile.comfortScore),
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Briefcase size={20} color={Colors.primary} />
            <Text style={styles.cardTitle}>Recent Work Completed</Text>
          </View>
          {latestWork ? (
            <>
              <View style={styles.workItem}>
                <CheckCircle size={18} color={Colors.success} />
                <View style={styles.workDetails}>
                  <Text style={styles.workTitle}>{latestWork.title}</Text>
                  <Text style={styles.workDate}>
                    {new Date(latestWork.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
              </View>
              <Text style={styles.workDescription}>{latestWork.description}</Text>
            </>
          ) : (
            <Text style={styles.workDescription}>Loading work history...</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/my-home')}
        >
          <View style={styles.actionContent}>
            <View>
              <Text style={styles.actionTitle}>View My Home Profile</Text>
              <Text style={styles.actionSubtitle}>
                See all completed work and documents
              </Text>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/my-home')}
        >
          <View style={styles.actionContent}>
            <View>
              <Text style={styles.actionTitle}>Next Recommended Upgrades</Text>
              <Text style={styles.actionSubtitle}>
                Explore ways to save even more
              </Text>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/tasks')}
        >
          <View style={styles.actionContent}>
            <View style={styles.actionWithIcon}>
              <Calendar size={20} color={Colors.secondary} />
              <View>
                <Text style={styles.actionTitle}>Seasonal Checklist</Text>
                <Text style={styles.actionSubtitle}>
                  Maintenance tasks for this season
                </Text>
              </View>
            </View>
            <ChevronRight size={24} color={Colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.primaryActionCard]}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/services')}
        >
          <Text style={styles.primaryActionText}>Request Service</Text>
          <ChevronRight size={24} color={Colors.surface} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingBottom: 32,
  },
  safeArea: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.surface,
  },
  logo: {
    width: 64,
    height: 64,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  summaryGrid: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
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
  savingsCard: {},
  comfortCard: {},
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: Colors.textLight,
  },
  comfortRow: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    marginBottom: 8,
  },
  comfortMax: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 2,
  },
  comfortBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  comfortBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
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
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  workItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    marginBottom: 8,
  },
  workDetails: {
    flex: 1,
  },
  workTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  workDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  workDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionCard: {
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
  actionContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  actionWithIcon: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  primaryActionCard: {
    backgroundColor: Colors.primary,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
  backendTestCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.secondary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      } as any,
    }),
  },
  backendHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  backendIconRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  backendTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  backendToggle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  backendContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  backendStatus: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  backendText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  refetchButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center' as const,
  },
  refetchText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
