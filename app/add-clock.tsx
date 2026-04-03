import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddClockScreen () {
  const [query, setQuery] = useState('');
  const navigation = useNavigation()
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}><Ionicons name="arrow-back" size={25}></Ionicons></Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Search city..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            autoFocus
            onChangeText={(text) => setQuery(text)}
            value={query}
          />
          {
            !!query && 
          <TouchableOpacity 
            onPress={() => setQuery('')}
            style={styles.delButton}
          >
            <Ionicons name='backspace-outline' color={'#fff'} size={25}></Ionicons>
          </TouchableOpacity>
          }
        </View>
      </View>

      <View style={styles.container}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  headerWrapper: {
    backgroundColor: '#0F0F0F',
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#777',
    backgroundColor: '#0F0F0F',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 0,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  delButton: {
    marginRight: 12
  },

  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
});