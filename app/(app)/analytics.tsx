import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useOverallStats,
  useRecentSessions,
  useModuleStats,
  useCategoryPerformance,
} from "../../src/hooks/useAnalytics";

export default function AnalyticsScreen() {
  const { data: overallStats, isLoading: loadingOverall } = useOverallStats();
  const { data: recentSessions, isLoading: loadingSessions } = useRecentSessions(10);
  const { data: moduleStats, isLoading: loadingModule } = useModuleStats("mcq");
  const { data: categoryPerformance, isLoading: loadingCategory } = useCategoryPerformance();

  const isLoading = loadingOverall || loadingSessions || loadingModule || loadingCategory;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading your analytics...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Analytics</Text>

        {/* Overall Stats */}
        {overallStats && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Overall Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{overallStats.totalQuestions}</Text>
                <Text style={styles.statLabel}>Questions Answered</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{overallStats.accuracy.toFixed(1)}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{overallStats.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{overallStats.longestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>
          </View>
        )}

        {/* Module Stats */}
        {moduleStats && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Practice Test Performance</Text>
            <View style={styles.moduleStatsContainer}>
              <View style={styles.moduleStatRow}>
                <Text style={styles.moduleStatLabel}>Total Attempts:</Text>
                <Text style={styles.moduleStatValue}>{moduleStats.total}</Text>
              </View>
              <View style={styles.moduleStatRow}>
                <Text style={styles.moduleStatLabel}>Correct Answers:</Text>
                <Text style={styles.moduleStatValue}>{moduleStats.correct}</Text>
              </View>
              <View style={styles.moduleStatRow}>
                <Text style={styles.moduleStatLabel}>Accuracy:</Text>
                <Text
                  style={[
                    styles.moduleStatValue,
                    moduleStats.percentage >= 80
                      ? styles.accuracyGood
                      : moduleStats.percentage >= 60
                      ? styles.accuracyMedium
                      : styles.accuracyPoor,
                  ]}
                >
                  {moduleStats.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Sessions */}
        {recentSessions && recentSessions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Sessions</Text>
            {recentSessions.slice(0, 5).map((session, index) => (
              <View key={index} style={styles.sessionItem}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                  <Text
                    style={[
                      styles.sessionAccuracy,
                      session.accuracy >= 80
                        ? styles.accuracyGood
                        : session.accuracy >= 60
                        ? styles.accuracyMedium
                        : styles.accuracyPoor,
                    ]}
                  >
                    {session.accuracy.toFixed(0)}%
                  </Text>
                </View>
                <Text style={styles.sessionDetails}>
                  {session.correct} / {session.total} correct
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Category Performance */}
        {categoryPerformance && categoryPerformance.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Performance by Category</Text>
            {categoryPerformance.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryAccuracy}>
                    {category.accuracy.toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.categoryBarContainer}>
                  <View
                    style={[
                      styles.categoryBar,
                      {
                        width: `${category.accuracy}%`,
                        backgroundColor:
                          category.accuracy >= 80
                            ? "#10b981"
                            : category.accuracy >= 60
                            ? "#f59e0b"
                            : "#ef4444",
                      },
                    ]}
                  />
                </View>
                <Text style={styles.categoryDetails}>
                  {category.correct} / {category.total} correct
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!overallStats && !moduleStats && (!recentSessions || recentSessions.length === 0) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Analytics Data Yet</Text>
            <Text style={styles.emptyText}>
              Complete practice sessions to see your progress and analytics here.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Navigation handled by tab bar
              }}
            >
              <Text style={styles.buttonText}>Start Practice</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  contentContainer: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  moduleStatsContainer: {
    gap: 12,
  },
  moduleStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  moduleStatLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  moduleStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  accuracyGood: {
    color: "#10b981",
  },
  accuracyMedium: {
    color: "#f59e0b",
  },
  accuracyPoor: {
    color: "#ef4444",
  },
  sessionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  sessionAccuracy: {
    fontSize: 16,
    fontWeight: "600",
  },
  sessionDetails: {
    fontSize: 14,
    color: "#6b7280",
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  categoryAccuracy: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  categoryBar: {
    height: "100%",
    borderRadius: 4,
  },
  categoryDetails: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    height: 50,
    backgroundColor: "#10b981",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

