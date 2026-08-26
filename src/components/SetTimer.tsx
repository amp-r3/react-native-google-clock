import { useMemo } from "react";
import { DialButton } from "./DialButton";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TimerKeyboard } from "../../app/(tabs)/timer";
import { useTheme } from "../theme/ThemeProvider";
import { ThemeColors } from "../theme/colors";

interface SetTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  numbsArr: TimerKeyboard;
  handlePress: (item: TimerKeyboard[number]) => void;
  handleStart: ()=> void;
}

export default function SetTimer({hours, minutes, seconds, numbsArr, handlePress, handleStart}: SetTimerProps) {
  const { colors } = useTheme();
  const style = useMemo(() => createStyles(colors), [colors]);

  return (
    <>

      <View style={style.timerContainer}>
        <Text style={style.numbers}>{String(hours).padStart(2, '0')}h.</Text>
        <Text style={style.numbers}>{String(minutes).padStart(2, '0')}m.</Text>
        <Text style={style.numbers}>{String(seconds).padStart(2, '0')}s.</Text>
      </View>
      <View>
        <View style={{ alignItems: 'center', marginTop: 90 }}>

          <View style={style.numKeyboard}>
            {
              numbsArr.map((item) => (
                <DialButton key={item} label={item} onPress={() => handlePress(item)} />
              ))
            }
          </View>
          <View style={{ marginTop: 15 }}>
            <DialButton label={<MaterialCommunityIcons name='play-outline' size={32} color={colors.textPrimary} />} onPress={handleStart} />
          </View>
        </View>
      </View>
    </>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  timerContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 30,
    paddingTop: 40,
  },
  numbers: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: 600,
  },
  numKeyboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 330,
    width: '100%',
    flexWrap: 'wrap',
    gap: 10,
  }
})
