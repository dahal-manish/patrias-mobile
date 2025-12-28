import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function StudyScreen() {
  const router = useRouter();

  const studyModules = [
    {
      id: "practice",
      title: "Practice Session",
      description: "10-question practice rounds with immediate feedback",
      icon: "play-circle" as const,
      color: "#10b981",
      route: "/(app)/practice",
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Study with interactive flashcards (Coming Soon)",
      icon: "albums" as const,
      color: "#3b82f6",
      route: null,
      comingSoon: true,
    },
    {
      id: "practice-test",
      title: "Practice Test",
      description: "Timed practice test simulation (Coming Soon)",
      icon: "timer" as const,
      color: "#8b5cf6",
      route: null,
      comingSoon: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Study Hub</Text>
        <Text style={styles.subtitle}>
          Choose a study mode to practice your civics knowledge
        </Text>

        <View style={styles.modulesContainer}>
          {studyModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={[
                styles.moduleCard,
                module.comingSoon && styles.moduleCardDisabled,
              ]}
              onPress={() => {
                if (module.route && !module.comingSoon) {
                  router.push(module.route as any);
                }
              }}
              disabled={module.comingSoon}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${module.color}15` }]}>
                <Ionicons name={module.icon} size={32} color={module.color} />
              </View>
              <View style={styles.moduleContent}>
                <View style={styles.moduleHeader}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  {module.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.moduleDescription}>{module.description}</Text>
              </View>
              {!module.comingSoon && (
                <Ionicons name="chevron-forward" size={24} color="#6b7280" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#10b981" />
          <Text style={styles.infoText}>
            Practice regularly to improve your accuracy and build confidence for
            your citizenship test.
          </Text>
        </View>
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
  contentContainer: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  modulesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 16,
  },
  moduleCardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  moduleContent: {
    flex: 1,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  comingSoonBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  moduleDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#065f46",
    lineHeight: 20,
  },
});

