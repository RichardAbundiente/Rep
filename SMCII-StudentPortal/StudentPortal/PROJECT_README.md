# SMCII Student Portal — React Native App

A 4-screen mobile app (Home, About, Contact, Profile) built with:
- **React Native (bare/CLI)**, TypeScript
- **Flexbox** layouts + the **StyleSheet API**
- **Stack Navigation** (`@react-navigation/native-stack`) with a custom bottom nav bar
- **react-native-linear-gradient** for the SMCII white/blue gradient theme
- Lightweight fade + slide-in animations (`Animated` API — no extra native deps)

## 1. Get the APK without installing anything

This repo ships with a GitHub Actions workflow (`.github/workflows/build-apk.yml`)
that automatically builds a signed, installable **debug APK** every time you push
to `main`. GitHub's own servers do the build — you don't need Android Studio,
a GitHub Pro plan, or an Expo account.

Steps:
1. Create a new **public or private** GitHub repository.
2. Push this project to it (see commands below).
3. Go to your repo → **Actions** tab → wait for "Build Android APK" to finish
   (first run takes ~5–8 minutes).
4. Once it's green, go to your repo's **Releases** page (right sidebar) —
   you'll find `app-debug.apk` attached to the latest release.
5. On your Android phone: download the APK (e.g. via the GitHub link, Google
   Drive, or `adb install`), open it, allow "install unknown apps" for your
   browser/file manager when prompted, and install.

You can also grab the APK from **Actions → (latest run) → Artifacts** without
waiting for a Release.

### Pushing this project to GitHub
```bash
cd StudentPortal
git init            # if not already a git repo
git add .
git commit -m "Initial commit: SMCII Student Portal"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Editing content
- Profile placeholder data: `src/screens/ProfileScreen.tsx` (the `STUDENT` object)
- About text: `src/screens/AboutScreen.tsx`
- Contact details: `src/screens/ContactScreen.tsx` (the `items` array)
- Theme colors: `src/theme/theme.ts`

## 3. Running locally (optional, needs Android Studio/emulator)
```bash
npm install
npx react-native run-android
```

## 4. Project structure
```
src/
  components/   FadeInView, GradientHeader, Card, BottomNavBar
  navigation/   RootNavigator.tsx (Stack.Navigator with 4 screens)
  screens/      HomeScreen, AboutScreen, ContactScreen, ProfileScreen
  theme/        theme.ts (colors, spacing, radius, shadow)
```
