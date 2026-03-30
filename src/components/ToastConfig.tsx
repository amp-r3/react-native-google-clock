import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps, ToastConfig } from 'react-native-toast-message';

const MaterialToast = ({ text1, text2 }: BaseToastProps) => (
  <View style={styles.container}>
    {text1 && <Text style={styles.text1}>{text1}</Text>}
    {text2 && <Text style={styles.text2}>{text2}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    minWidth: '80%',
    maxWidth: '90%',
    backgroundColor: '#2B2D30',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  text1: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  text2: {
    color: '#ABABAB',
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.1,
  },
});

export const toastConfig: ToastConfig = {
  success: (props) => <MaterialToast {...props} />,
  error: (props) => <MaterialToast {...props} />,
  info: (props) => <MaterialToast {...props} />,
};