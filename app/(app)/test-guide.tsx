import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TestGuideScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>U.S. Naturalization Test Guide</Text>
          <Text style={styles.subtitle}>
            Everything you need to know about the citizenship test
          </Text>
        </View>

        {/* Quick Overview Card */}
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>
            Which Civics Test Applies to You?
          </Text>
          <Text style={styles.highlightText}>
            The version you take depends on when you filed Form N-400 (Application for Naturalization).
          </Text>

          <View style={styles.testVersionContainer}>
            {/* 2008 Test */}
            <View style={[styles.testCard, styles.testCard2008]}>
              <Text style={styles.testCardTitle}>
                Filed before October 20, 2025
              </Text>
              <Text style={styles.testCardSubtitle}>2008 Civics Test</Text>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.checkText}>100 possible questions</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.checkText}>Officer asks up to 10</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.checkText}>Pass with 6 correct</Text>
              </View>
            </View>

            {/* 2025 Test */}
            <View style={[styles.testCard, styles.testCard2025]}>
              <Text style={[styles.testCardTitle, { color: "#059669" }]}>
                Filed on or after October 20, 2025
              </Text>
              <Text style={[styles.testCardSubtitle, { color: "#059669" }]}>
                2025 Civics Test
              </Text>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.checkText}>128 possible questions</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.checkText}>Officer asks 20</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.checkText}>Pass with 12 correct</Text>
              </View>
            </View>
          </View>
        </View>

        {/* PDF Downloads */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="download" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Official Study Materials</Text>
          </View>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              openLink(
                "https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf"
              )
            }
          >
            <Ionicons name="document-text" size={20} color="#10b981" />
            <Text style={styles.linkButtonText}>
              2008 Civics Questions (100 PDF)
            </Text>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              openLink(
                "https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf"
              )
            }
          >
            <Ionicons name="document-text" size={20} color="#10b981" />
            <Text style={styles.linkButtonText}>
              2025 Civics Questions (128 PDF)
            </Text>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* What's on the Test */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>
              What's on the Naturalization Test?
            </Text>
          </View>
          <Text style={styles.sectionText}>
            The naturalization test includes two parts: an English test and a
            Civics test. The test is given during your naturalization interview
            with a USCIS officer.
          </Text>
          <Text style={styles.sectionText}>
            <Text style={styles.boldText}>Patrias focuses on helping you prepare for the Civics portion.</Text>
          </Text>
        </View>

        {/* English Test */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="globe" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>English Test Overview</Text>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Speaking:</Text> evaluated during your interview
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Reading:</Text> read 1 out of 3 sentences correctly
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Writing:</Text> write 1 out of 3 sentences correctly
              </Text>
            </View>
          </View>
        </View>

        {/* Civics Test Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Civics Test Overview</Text>
          </View>
          <Text style={styles.sectionText}>
            Both test versions cover U.S. history, government, and symbols. The
            Patrias platform supports both the 2008 and 2025 question banks.
          </Text>
        </View>

        {/* Special Consideration */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>
              Special Consideration (65/20 Rule)
            </Text>
          </View>
          <Text style={styles.sectionText}>
            If you are 65 or older and have been a lawful permanent resident for
            20 years or more, you qualify for a smaller question set.
          </Text>
          <Text style={styles.sectionText}>
            The officer will ask from a special 20-question pool tied to your
            test version.
          </Text>
        </View>

        {/* Retesting */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Retesting and Results</Text>
          </View>
          <Text style={styles.sectionText}>
            You will be given <Text style={styles.boldText}>two attempts</Text> to take the English and civics tests and to answer all questions relating to your naturalization application in English.
          </Text>
          <Text style={styles.sectionText}>
            If you fail any of the tests at your initial interview, you will be
            retested on the portion of the test that you failed (English or
            civics) between 60 and 90 days from the date of your initial
            interview.
          </Text>
        </View>

        {/* Form N-400 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>What Is Form N-400?</Text>
          </View>
          <Text style={styles.sectionText}>
            Form N-400 is the Application for Naturalization — it's how you
            apply for U.S. citizenship.
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openLink("https://www.uscis.gov/n-400")}
          >
            <Ionicons name="link" size={20} color="#10b981" />
            <Text style={styles.linkButtonText}>N-400 Form Overview</Text>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="warning" size={24} color="#f59e0b" />
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              • Patrias is an independent study tool and not affiliated with USCIS.
            </Text>
            <Text style={styles.disclaimerText}>
              • All information is based on official USCIS resources.
            </Text>
            <Text style={styles.disclaimerText}>
              • For official guidance, always check USCIS.gov
            </Text>
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Additional Resources</Text>
          </View>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              openLink(
                "https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test"
              )
            }
          >
            <Ionicons name="school" size={20} color="#10b981" />
            <Text style={styles.linkButtonText}>
              Official USCIS Study Resources
            </Text>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              openLink(
                "https://www.uscis.gov/citizenship/learn-about-citizenship/10-steps-to-naturalization"
              )
            }
          >
            <Ionicons name="list" size={20} color="#10b981" />
            <Text style={styles.linkButtonText}>10 Steps to Naturalization</Text>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#f59e0b" />
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Tip:</Text> Practice daily to build
            confidence. The more you study, the better prepared you'll be for
            your interview!
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
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
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
    lineHeight: 22,
  },
  highlightCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#10b981",
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: "#047857",
    marginBottom: 16,
    lineHeight: 20,
  },
  testVersionContainer: {
    gap: 12,
  },
  testCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
  },
  testCard2008: {
    borderColor: "#3b82f6",
  },
  testCard2025: {
    borderColor: "#10b981",
  },
  testCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  testCardSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  checkText: {
    fontSize: 14,
    color: "#374151",
  },
  section: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  sectionText: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "600",
    color: "#1f2937",
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  linkButtonText: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  disclaimerCard: {
    flexDirection: "row",
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fde68a",
    gap: 12,
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
    marginBottom: 4,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#92400e",
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: "600",
  },
});

