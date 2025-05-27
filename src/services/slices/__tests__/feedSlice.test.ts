import {
  feedSlice,
  FeedsThunk,
  getOrders,
  getTotal,
  getTotalToday
} from '../feedSlice';
import { TOrdersData } from '@utils-types';

const reducer = feedSlice.reducer;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const sliceInitialState = { feeds: { orders: [], total: 0, totalToday: 0 } };

const payload: TOrdersData = {
  orders: [
    {
      _id: '1',
      name: 'Order',
      ingredients: [],
      status: 'done',
      number: 1,
      createdAt: '',
      updatedAt: ''
    }
  ],
  total: 10,
  totalToday: 5
};

describe('feedSlice reducer', () => {
  it('fulfilled writes feeds', () => {
    const state = reducer(sliceInitialState, {
      type: FeedsThunk.fulfilled.type,
      payload
    });
    expect(state.feeds).toEqual(payload);
  });

  it('rejected keeps state', () => {
    const state = reducer(sliceInitialState, {
      type: FeedsThunk.rejected.type
    });
    expect(state).toEqual(sliceInitialState);
  });
});

describe('feedSlice selectors', () => {
  const rootState = { feeds: { feeds: payload } };

  it('getOrders returns list', () => {
    expect(getOrders(rootState)).toEqual(payload.orders);
  });

  it('getTotal returns total', () => {
    expect(getTotal(rootState)).toBe(10);
  });

  it('getTotalToday returns totalToday', () => {
    expect(getTotalToday(rootState)).toBe(5);
  });
});
