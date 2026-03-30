import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BaseToastProps, ToastConfig } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

interface MaterialToastProps extends BaseToastProps {
  props?: {
    onUndo?: () => void;
  };
  type?: 'success' | 'info' | 'error';
}

const MaterialToast = ({ text1, text2, props, type = 'info' }: MaterialToastProps) => {
  const backgroundColor = '#2B2D30';
  const iconColor = '#E3E3E3';
  const textColor1 = '#E3E3E3';
  const textColor2 = '#ABABAB';
  const undoColor = '#E3E3E3';

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Ionicons
          name={getIconName()}
          size={26}
          color={iconColor}
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          {text1 && <Text style={[styles.text1, { color: textColor1 }]}>{text1}</Text>}
          {text2 && <Text style={[styles.text2, { color: textColor2 }]}>{text2}</Text>}
        </View>
      </View>

      {props?.onUndo && (
        <TouchableOpacity
          onPress={() => {
            props.onUndo?.();
          }}
          style={styles.undoButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.undoText, { color: undoColor }]}>
            Отмена
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: '80%',
    maxWidth: '90%',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  text2: {
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  undoButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  undoText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

export const toastConfig: ToastConfig = {
  success: (props) => <MaterialToast {...props} type="success" />,
  error: (props) => <MaterialToast {...props} type="error" />,
  info: (props) => <MaterialToast {...props} type="info" />,
};