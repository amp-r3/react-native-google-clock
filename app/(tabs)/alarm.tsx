import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmItem from '@/src/components/AlarmItem';

const MOCK_ALARMS = [
  {
    id: '1',
    time: '06:00',
    period: 'AM',
    label: 'Work',
    days: 'Mon, Tue, Thu, Fri, Sat',
    enabled: true,
  },
  {
    id: '2',
    time: '06:30',
    period: 'AM',
    label: 'Day off',
    days: 'Wed, Sun',
    enabled: false,
  },
  {
    id: '3',
    time: '08:00',
    period: 'AM',
    label: 'Gym',
    days: 'Wed, Sun',
    enabled: false,
  },
];

export default function AlarmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alarms</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_ALARMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AlarmItem alarm={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => router.push('/add-alarm')}
      >
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});