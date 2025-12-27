import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TabItem {
  name: string;
  label: string;
  icon: string;
  route: string;
}

const tabs: TabItem[] = [
  { name: "home", label: "Home", icon: "home", route: "/(app)/home" },
  { name: "study", label: "Study", icon: "book", route: "/(app)/study" },
  { name: "test-guide", label: "Test Guide", icon: "document-text", route: "/(app)/test-guide" },
  { name: "analytics", label: "Analytics", icon: "bar-chart", route: "/(app)/analytics" },
  { name: "profile", label: "Profile", icon: "person", route: "/(app)/profile" },
];

export function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    // Normalize paths for comparison
    const normalizedPathname = pathname?.replace(/\/$/, "") || "";
    const normalizedRoute = route.replace(/\/$/, "");
    return normalizedPathname === normalizedRoute || normalizedPathname.startsWith(normalizedRoute + "/");
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={active ? "#10b981" : "#6b7280"}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  labelActive: {
    color: "#10b981",
  },
});

