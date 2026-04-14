import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";

interface DialButtonProps {
  label: ReactNode;
  onPress: () => void
}


export function DialButton({ label, onPress }: DialButtonProps) {
  return (
    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: 90, width: 90, borderRadius: 99, backgroundColor: '#303030' }} onPress={onPress}>
      {typeof label === typeof MaterialCommunityIcons ?
        <label></label> :
        <Text style={{ color: '#fff', fontSize: 30, fontWeight: 900 }}>{label}</Text>
      }
    </TouchableOpacity>
  )
}