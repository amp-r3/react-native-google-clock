# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Google Clock clone built with Expo (SDK 54) + Expo Router + React Native 0.81, TypeScript. Four core features: Alarms, Clocks (world clock), Timer, Stopwatch, each a tab under `app/(tabs)/`.

## Commands

- `npm start` — start the Expo dev server
- `npm run android` — build and run on Android (`expo run:android`)
- `npm run ios` — build and run on iOS (`expo run:ios`)
- `npm run web` — run in a browser (`expo start --web`)
- `npm run lint` — run `expo lint` (ESLint, flat config via `eslint-config-expo`)

There is no test suite configured in this repo. There is no separate typecheck script — use `npx tsc --noEmit` if you need to verify types.

The `android/` directory is a generated prebuild output (git-ignored, see `c4652b25`) — do not hand-edit it; regenerate with `npx expo prebuild` if native config changes are needed. `ios/` is likewise git-ignored and not present.

## Architecture

**Routing**: `expo-router` with file-based routes in `app/`. `app/_layout.tsx` is the root stack, wrapping everything in the Redux `Provider`/`PersistGate` and `GestureHandlerRootView`. `app/(tabs)/_layout.tsx` defines a custom animated bottom tab bar (a sliding "pill" indicator) for the four main screens (`alarm`, `clock`, `timer`, `stopwatch`). Modal screens (`add-alarm`, `add-clock`, `alarmScreen`) are pushed onto the root `Stack`, not the tab navigator.

**State**: Redux Toolkit store at `src/store/store.ts`, combined via `src/store/rootReducer.ts`. Each domain (`alarmSlice.ts`, `clockSlice.ts`) is persisted independently through `redux-persist` + `AsyncStorage`, each with its own `whitelist` — when adding new slice state, decide explicitly whether it belongs in the persisted whitelist.

**Domain logic lives outside components**: alarm scheduling/date math is in `src/utils/alarmUtils.ts` (e.g. `getNextAlarmDay`, `parseTime` — handles both recurring `days[]` alarms and one-time `date` alarms), clock/timezone math in `src/utils/clockUtils.ts` (uses `city-timezones` + `date-fns-tz`). Form/edit state for alarms is centralized in the hooks `src/hooks/useAlarmForm.ts` and `src/hooks/useExistingAlarm.ts` rather than in the screen components — follow this pattern for new alarm-editing UI rather than putting logic in `add-alarm.tsx`/`alarmScreen.tsx` directly.

**Haptics**: All tactile feedback goes through `src/hooks/useHaptics.ts`, a thin semantic wrapper over `expo-haptics` (`onToggle`, `onPress`, `onSave`, `onDelete`, `onSelect`, etc.). Use these named methods instead of calling `expo-haptics` directly, so feedback stays consistent across screens.

**Toasts**: `react-native-toast-message` is configured once via `src/components/ToastConfig.tsx` and mounted in the root layout; trigger toasts with the library's `Toast.show(...)` API rather than building ad hoc notice UI.

**List rows / swipe actions**: `src/components/SwipeableRow.tsx` wraps `AlarmItem`, `ClockItem`, `TimerItem`, `LapItem` to provide swipe-to-delete/edit — reuse it for new list rows instead of reimplementing gesture handling.

**Reanimated/worklets**: `react-native-reanimated` (`~4.1.1`) and `react-native-worklets` are present — check existing animated components (e.g. the tab bar pill, `SwipeableRow`) for the established animation style before introducing a new approach.
