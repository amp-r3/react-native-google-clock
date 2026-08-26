import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import { useCitySearch, City } from '../../src/hooks/useCitySearch';
import { selectSettings, setHomeTimezone } from '../../src/store/settingsSlice';

export default function HomeTimezoneScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { homeTimezoneId } = useSelector(selectSettings);
  const { query, results, handleSearch, clear } = useCitySearch();

  const handleSelect = (city: City) => {
    dispatch(setHomeTimezone(city.timezone));
    navigation.goBack();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
            <TouchableOpacity onPress={clear} style={styles.clearButton}>
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
              const isSelected = homeTimezoneId === item.timezone;
              return (
                <TouchableOpacity
                  style={isSelected ? [styles.resultItem, styles.resultItemSelected] : styles.resultItem}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cityInfo}>
                    <Text style={styles.cityText}>{item.city}</Text>
                    <Text style={styles.countryText}>{item.country}</Text>
                  </View>
                  {isSelected && (
                    <MaterialCommunityIcons name="checkbox-marked-circle-outline" color={colors.accent} size={26} />
                  )}
                </TouchableOpacity>
              );
            }}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.resultsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="magnify" color={colors.textSecondary} size={80} />
            <Text style={styles.emptyStateText}>City search</Text>
          </View>
        )}
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
  resultItemSelected: {
    backgroundColor: colors.surface,
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
