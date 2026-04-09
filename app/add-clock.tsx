import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import cityTimezones from 'city-timezones';
import { addClock, removeClock, selectClocks } from "../src/store/clockSlice";
import { useDispatch, useSelector } from "react-redux";
import { getFormattedTime } from "../src/utils/clockUtils";

const ALL_CITIES = cityTimezones.cityMapping;

type City = {
  city: string;
  country: string;
  timezone: string;
};

// Helpers
const searchCities = (query: string): City[] => {
  if (query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return ALL_CITIES
    .filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map((c) => ({ city: c.city, country: c.country, timezone: c.timezone }));
};



export default function AddClockScreen() {
  const clocks = useSelector(selectClocks);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    setResults(searchCities(text));
  }, []);

  const handleSelect = useCallback((city: City) => {
    if (clocks.find((c) => c.timezone === city.timezone)) {
      dispatch(removeClock(city.timezone))
      navigation.goBack();
      return
    };
    dispatch(addClock(city));
    setQuery('');
    setResults([]);
    navigation.goBack();
  }, [clocks, dispatch, navigation]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color="#F5F5F5" />
        </TouchableOpacity>

        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search city or country..."
            placeholderTextColor="#9E9E9E"
            style={styles.searchInput}
            autoFocus
            onChangeText={handleSearch}
            value={query}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setResults([]);
              }}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons name="close-circle" size={24} color="#9E9E9E" />
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
                  style={isSaved ? [styles.resultItem, { backgroundColor: '#191919' }] : styles.resultItem}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cityInfo}>
                    <Text style={styles.cityText}>{item.city}</Text>
                    <Text style={styles.countryText}>{item.country}</Text>
                  </View>
                  {
                    isSaved &&
                    <MaterialCommunityIcons name="checkbox-marked-circle-outline" color='#fff' size={26} style={{ marginHorizontal: 15 }}></MaterialCommunityIcons>
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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 400}}>
          <MaterialCommunityIcons name="magnify" color='#AAA' size={80}></MaterialCommunityIcons>
          <Text style={{fontSize: 22, color: '#AAA'}}>City ​​search</Text>
        </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F0F0F',
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
    backgroundColor: '#1C1B1F',
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
    color: '#F5F5F5',
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
  cityInfo: {
    flex: 1,
  },
  cityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F5F5',
    letterSpacing: -0.3,
  },
  countryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9E9E9E',
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
    color: '#757575',
  },
  period: {
    fontSize: 12,
    fontWeight: '500',
    color: '#757575'
  },
  separator: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginHorizontal: 24,
  },
});