import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useRef, useState } from "react";
import { TimerStatus } from "../../app/(tabs)/timer";

interface TimerItemProps {
  timeSet: number;      
  timeLeft: number;       
  formatTime: (seconds: number) => string;
  handleClear: () => void;
  handleStop: () => void;
  handleStart: () => void;
  handleAdd: () => void;
  handleReset: () => void;
  handleFinish: () => void;
  status: TimerStatus;
  onTimeUpdate: (remainingTime: number) => void;
}

export default function TimerItem({
  timeSet,
  timeLeft,
  status,
  formatTime,
  handleClear,
  handleStop,
  handleStart,
  handleAdd,
  handleReset,
  handleFinish,
  onTimeUpdate,
}: TimerItemProps) {

  const [key, setKey] = useState(0);

  const [localDuration, setLocalDuration] = useState(timeSet);
  const [localInitial, setLocalInitial] = useState(timeLeft);

  const remainingRef = useRef(timeLeft);

  const isPlaying = status === 'running';

  const addTimer = () => {
    const newInitial = remainingRef.current + 60;
    const newDuration = localDuration + 60;
  
    remainingRef.current = newInitial;  
  
    setLocalInitial(newInitial);
    setLocalDuration(newDuration);
    handleAdd();
    setKey(prev => prev + 1);
  };

  const resetTimer = () => {
    setLocalDuration(timeSet);
    setLocalInitial(timeSet);
    handleReset(); 
    setKey(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={handleClear} activeOpacity={0.7}>
        <MaterialCommunityIcons name="close" color="#fff" size={20} />
      </TouchableOpacity>

      <View style={styles.middle}>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={localDuration}
          initialRemainingTime={localInitial}
          size={300}
          strokeWidth={14}
          colors="#ffffff"
          trailColor="#333333"
          rotation="clockwise"
          updateInterval={0.001}
          onUpdate={(t) => {
            remainingRef.current = t;
            onTimeUpdate(t);
          }}
          onComplete={() => {
            handleFinish();
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }) => (
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(remainingTime)}</Text>
              
              <TouchableOpacity style={styles.reset} onPress={resetTimer} activeOpacity={0.7}>
                <MaterialCommunityIcons name="restart" color="#fff" size={38} />
              </TouchableOpacity>
            </View>
          )}
        </CountdownCircleTimer>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.addTime} onPress={addTimer}>
          <Text style={styles.addTimeText}>+1:00</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.pause} 
          onPress={status === 'running' ? handleStop : handleStart}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name={status === 'running' ? 'pause' : 'play'} 
            color="#121212" 
            size={32} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    borderRadius: 20,
  },
  close: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: 30,
    height: 30,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 55,
    color: '#fff',
    fontWeight: '500',
  },
  reset: {
    position: 'absolute',
    bottom: -55,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 50,
    gap: 12,
  },
  addTime: {
    backgroundColor: '#282828',
    width: 130,
    height: 90,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeText: {
    fontWeight: '600',
    fontSize: 22,
    color: '#fff',
  },
  pause: {
    backgroundColor: '#fff',
    width: 130,
    height: 90,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});