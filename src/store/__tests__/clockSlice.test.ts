import reducer, { addClock, Clock, removeClock, reorderClocks } from '../clockSlice';

const paris = { city: 'Paris', country: 'France', timezone: 'Europe/Paris' };
const tokyo = { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' };

describe('clockSlice reducer', () => {
  it('adds a clock keyed by timezone', () => {
    const state = reducer({ clocks: [] }, addClock(paris));
    expect(state.clocks).toEqual([{ id: 'Europe/Paris', ...paris }]);
  });

  it('dedupes clocks with the same timezone', () => {
    const once = reducer({ clocks: [] }, addClock(paris));
    const twice = reducer(once, addClock(paris));
    expect(twice.clocks).toHaveLength(1);
  });

  it('removes a clock by id', () => {
    const initial = { clocks: [{ id: paris.timezone, ...paris }, { id: tokyo.timezone, ...tokyo }] };
    const state = reducer(initial, removeClock(paris.timezone));
    expect(state.clocks.map((c) => c.id)).toEqual([tokyo.timezone]);
  });

  it('replaces the list on reorder', () => {
    const a: Clock = { id: paris.timezone, ...paris };
    const b: Clock = { id: tokyo.timezone, ...tokyo };
    const state = reducer({ clocks: [a, b] }, reorderClocks([b, a]));
    expect(state.clocks).toEqual([b, a]);
  });
});
