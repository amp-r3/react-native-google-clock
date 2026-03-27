import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export function useExistingAlarm(id?: string) {
  return useSelector((state: RootState) =>
    id ? state.alarm.alarms.find((a) => a.id === id) : undefined
  );
}