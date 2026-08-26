import reducer, { Alarm, addAlarm, deleteAlarm, editAlarm, enableAlarm } from '../alarmSlice';

const makeAlarm = (overrides: Partial<Alarm> = {}): Alarm => ({
  id: '1',
  time: '6:00',
  period: 'AM',
  label: 'Alarm',
  days: [],
  options: { vibration: true, weather: false },
  enabled: true,
  date: null,
  ...overrides,
});

describe('alarmSlice reducer', () => {
  it('adds an alarm', () => {
    const state = reducer({ alarms: [] }, addAlarm(makeAlarm()));
    expect(state.alarms).toHaveLength(1);
    expect(state.alarms[0].id).toBe('1');
  });

  it('edits an existing alarm by merging fields', () => {
    const initial = { alarms: [makeAlarm({ label: 'Old' })] };
    const state = reducer(initial, editAlarm({ id: '1', editedAlarm: { label: 'New' } }));
    expect(state.alarms[0].label).toBe('New');
    expect(state.alarms[0].time).toBe('6:00');
  });

  it('does nothing when editing an unknown alarm id', () => {
    const initial = { alarms: [makeAlarm()] };
    const state = reducer(initial, editAlarm({ id: 'missing', editedAlarm: { label: 'New' } }));
    expect(state.alarms[0].label).toBe('Alarm');
  });

  it('deletes an alarm by id', () => {
    const initial = { alarms: [makeAlarm({ id: '1' }), makeAlarm({ id: '2' })] };
    const state = reducer(initial, deleteAlarm({ id: '1' }));
    expect(state.alarms.map((a) => a.id)).toEqual(['2']);
  });

  it('toggles enabled on enableAlarm', () => {
    const initial = { alarms: [makeAlarm({ enabled: true })] };
    const once = reducer(initial, enableAlarm({ id: '1' }));
    expect(once.alarms[0].enabled).toBe(false);
    const twice = reducer(once, enableAlarm({ id: '1' }));
    expect(twice.alarms[0].enabled).toBe(true);
  });
});
