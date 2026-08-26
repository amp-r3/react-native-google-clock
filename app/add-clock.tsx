import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addClock, removeClock, selectClocks } from "../src/store/clockSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedTime } from "../src/utils/clockUtils";
import { useHaptics } from "../src/hooks/useHaptics";
import { useCitySearch, City } from "../src/hooks/useCitySearch";
import { useTheme } from "../src/theme/ThemeProvider";
import { ThemeColors } from "../src/theme/colors";

export default function AddClockScreen() {
  const clocks = useSelector(selectClocks);
  const { query, results, handleSearch, clear } = useCitySearch();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { onToggle, onSelect, onDelete, onSoftPress } = useHaptics();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSelect = useCallback((city: City) => {
    if (clocks.find((c) => c.timezone === city.timezone)) {
      onDelete();
      dispatch(removeClock(city.timezone));
      navigation.goBack();
      return;
    }
    onSelect();
    dispatch(addClock(city));
    clear();
    navigation.goBack();
  }, [clocks, dispatch, navigation, onDelete, onSelect, clear]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { onToggle(); navigation.goBack() }}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search city or country..."
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
            autoFocus
            onChangeText={handleSearch}
            value={query}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                onSoftPress();
                clear();
              }}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons name="close-circle" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.resultsContainer}>
        {results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item, i) => `${item.city}-${item.timezone}-${i}`}
            renderItem={({ item }) => {
              const time = getFormattedTime(item.timezone)
              const [h, m] = time.split(':');
              const hour = parseInt(h, 10);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const display12 = `${String(hour % 12 || 12).padStart(2, '0')}:${m}`;
              const isSaved = clocks.some((c) => c.timezone === item.timezone)
              return (
                <TouchableOpacity
                  style={isSaved ? [styles.resultItem, styles.resultItemSaved] : styles.resultItem}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cityInfo}>
                    <Text style={styles.cityText}>{item.city}</Text>
                    <Text style={styles.countryText}>{item.country}</Text>
                  </View>
                  {
                    isSaved &&
                    <MaterialCommunityIcons name="checkbox-marked-circle-outline" color={colors.textPrimary} size={26} style={{ marginHorizontal: 15 }}></MaterialCommunityIcons>
                  }
                  <View style={styles.timeRow}>
                    <Text style={styles.time}>{display12}</Text>
                    <Text style={styles.period}>{ampm}</Text>
                  </View>
                </TouchableOpacity>
              )
            }}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.resultsList}
          />
        ) :
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" color={colors.textSecondary} size={80}></MaterialCommunityIcons>
          <Text style={styles.emptyStateText}>City ​​search</Text>
        </View>
        }
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: 20,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },

  resultsContainer: {
    flex: 1,
    marginTop: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 12,
  },
  resultsList: {
    paddingVertical: 8,
    gap: 8,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resultItemSaved: {
    backgroundColor: colors.surfaceSecondary,
  },
  cityInfo: {
    flex: 1,
  },
  cityText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  countryText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  period: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 400,
  },
  emptyStateText: {
    fontSize: 22,
    color: colors.textSecondary,
  },
});
