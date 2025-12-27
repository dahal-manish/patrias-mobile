# Troubleshooting Tabs Error: "expected dynamic type 'boolean', but had type 'string'"

## Error
```
ERROR  [Error: Exception in HostFunction: TypeError: expected dynamic type 'boolean', but had type 'string']
Code: _layout.tsx
<Tabs
```

## Possible Causes & Solutions

### 1. Install @expo/vector-icons Explicitly
Even though it's included with Expo, sometimes it needs to be installed explicitly:

```bash
cd patrias-mobile
npm install @expo/vector-icons
```

### 2. Clear Metro Cache and Rebuild
```bash
npx expo start -c
# Or
watchman watch-del-all
npm start -- --reset-cache
```

### 3. Check React/Expo Router Compatibility
You're using:
- React 19.1.0
- Expo Router 6.0.19
- Expo ~54.0.29

There might be a compatibility issue. Try downgrading React to 18.x:
```bash
npm install react@18 react-dom@18
```

### 4. Alternative: Use Slot Instead of Tabs Temporarily
If Tabs continues to fail, we can use a custom bottom navigation bar with Slot:

```tsx
import { Slot } from "expo-router";
// Then create a custom bottom tab bar component
```

### 5. Check for Conflicting Dependencies
```bash
npm ls @react-navigation/bottom-tabs
npm ls @react-navigation/native
```

### 6. Try Minimal Tabs Configuration
Test with absolute minimum:

```tsx
<Tabs>
  <Tabs.Screen name="home" />
  <Tabs.Screen name="study" />
</Tabs>
```

If this works, add options one by one to find the culprit.

### 7. Check Expo Router Version
```bash
npm list expo-router
```

Consider updating to latest:
```bash
npx expo install expo-router@latest
```

## Current Code State
The `_layout.tsx` file is now using a clean, minimal configuration. If the error persists, it's likely:
1. A dependency/version compatibility issue
2. A Metro bundler cache issue
3. A React Native bridge serialization issue

## Next Steps
1. Try installing @expo/vector-icons explicitly
2. Clear cache and restart
3. If still failing, consider using a custom bottom navigation component instead of Tabs

