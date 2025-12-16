import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useProgress } from "../../src/context/ProgressContext";

export default function ProgressScreen() {
  const { lastSession } = useProgress();
  const router = useRouter();

  // Format date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {!lastSession ? (
        // No session completed yet
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Practice Sessions Yet</Text>
          <Text style={styles.emptyText}>
            Complete a 10-question practice session to see your progress here.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(app)/practice")}
          >
            <Text style={styles.buttonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Show last session results
        <View style={styles.progressContainer}>
          <Text style={styles.title}>Your Progress</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Practice Session</Text>
            <Text style={styles.dateText}>
              {formatDate(lastSession.completedAt)}
            </Text>

            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{lastSession.score}</Text>
                <Text style={styles.scoreTotal}>/ {lastSession.total}</Text>
              </View>
              <Text style={styles.percentageText}>
                {lastSession.percentage}%
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Correct Answers:</Text>
                <Text style={styles.detailValue}>{lastSession.score}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Questions:</Text>
                <Text style={styles.detailValue}>{lastSession.total}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Score:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    lastSession.percentage >= 80
                      ? styles.detailValueGood
                      : lastSession.percentage >= 60
                      ? styles.detailValueMedium
                      : styles.detailValuePoor,
                  ]}
                >
                  {lastSession.percentage}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.encouragementContainer}>
            {lastSession.percentage >= 80 ? (
              <>
                <Text style={styles.encouragementEmoji}>🎉</Text>
                <Text style={styles.encouragementText}>
                  Excellent work! Keep practicing to maintain your high score.
                </Text>
              </>
            ) : lastSession.percentage >= 60 ? (
              <>
                <Text style={styles.encouragementEmoji}>👍</Text>
                <Text style={styles.encouragementText}>
                  Good job! A bit more practice and you'll be scoring even higher.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.encouragementEmoji}>💪</Text>
                <Text style={styles.encouragementText}>
                  Keep practicing! Review the questions you missed and try again.
                </Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(app)/practice")}
          >
            <Text style={styles.buttonText}>Practice Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
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
  progressContainer: {
    width: "100%",
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
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreCircle: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10b981",
  },
  scoreTotal: {
    fontSize: 32,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 4,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#10b981",
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  detailLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  detailValueGood: {
    color: "#10b981",
  },
  detailValueMedium: {
    color: "#f59e0b",
  },
  detailValuePoor: {
    color: "#ef4444",
  },
  encouragementContainer: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  encouragementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 16,
    color: "#1e40af",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    height: 50,
    backgroundColor: "#10b981",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
