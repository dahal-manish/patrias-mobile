import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useProgress } from "../../src/context/ProgressContext";
import { useRouter } from "expo-router";

export default function AnalyticsScreen() {
  const { lastSession } = useProgress();
  const router = useRouter();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Analytics</Text>

        {/* Last Session Stats */}
        {lastSession && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Practice Session</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{lastSession.score}</Text>
                <Text style={styles.statLabel}>Correct Answers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{lastSession.total}</Text>
                <Text style={styles.statLabel}>Total Questions</Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[
                    styles.statValue,
                    lastSession.percentage >= 80
                      ? styles.accuracyGood
                      : lastSession.percentage >= 60
                      ? styles.accuracyMedium
                      : styles.accuracyPoor,
                  ]}
                >
                  {lastSession.percentage}%
                </Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatDate(lastSession.completedAt)}
                </Text>
                <Text style={styles.statLabel}>Date</Text>
              </View>
            </View>
          </View>
        )}

        {/* Coming Soon Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            We're working on bringing you comprehensive analytics including:
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Overall statistics and trends</Text>
            <Text style={styles.featureItem}>• Performance by category</Text>
            <Text style={styles.featureItem}>• Study streaks and achievements</Text>
            <Text style={styles.featureItem}>• Detailed session history</Text>
          </View>
        </View>

        {/* Empty State */}
        {!lastSession && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Analytics Data Yet</Text>
            <Text style={styles.emptyText}>
              Complete practice sessions to see your progress and analytics here.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push("/(app)/practice");
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
  comingSoonText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 24,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
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
  accuracyGood: {
    color: "#10b981",
  },
  accuracyMedium: {
    color: "#f59e0b",
  },
  accuracyPoor: {
    color: "#ef4444",
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

