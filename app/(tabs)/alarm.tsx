import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmItem from '../../src/components/AlarmItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store/store';
import { AlarmEmpty } from '../../src/components/AlarmEmpty';
import SwipeableRow from '../../src/components/SwipeableRow';
import { Alarm, addAlarm, deleteAlarm } from '../../src/store/alarmSlice';
import Toast from 'react-native-toast-message';

export default function AlarmScreen() {
  const alarms = useSelector((state: RootState) => state.alarm.alarms)
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()

  const removeAlarm = (item: Alarm) => {
    if (item.id) {
      dispatch(deleteAlarm({id: item.id}));
      Toast.show({
        type: 'info',
        text1: "The alarm has been removed.",
        position: 'bottom',
        visibilityTime: 2500,
        props: {
          onUndo: () => {
            Toast.hide()
            dispatch(addAlarm(item));
          },
        },
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
  
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alarms</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
  
      {alarms.length < 1 ? (
        <AlarmEmpty />
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableRow onRemove={() => removeAlarm(item)}>
              <AlarmItem alarm={item} />
            </SwipeableRow>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
  
      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 16 }]}  
        activeOpacity={0.9}
        onPress={() => router.push('/add-alarm')}
      >
        <MaterialCommunityIcons name="plus" size={38}  style={styles.fabIcon} />
      </TouchableOpacity>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',          
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F0F0F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,                   
    paddingTop: 8,
  },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,                     
    width: 86,
    height: 86,
    borderRadius: 22,                  
    backgroundColor: '#FFFFFF',        
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    color: '#262626',
  },
});