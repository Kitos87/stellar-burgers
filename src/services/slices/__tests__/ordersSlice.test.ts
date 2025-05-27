import {
  ordersSlice,
  userOrdersThunk,
  isload,
  getUserOrders
} from '../orderSlice';
import { TOrder } from '@utils-types';

const reducer = ordersSlice.reducer;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const sliceInitialState = { isLoad: false, userOrders: [] as TOrder[] };

const order: TOrder = {
  _id: '1',
  name: 'Order',
  ingredients: [],
  status: 'done',
  number: 1,
  createdAt: '',
  updatedAt: ''
};

describe('ordersSlice reducer', () => {
  it('pending sets load', () => {
    const state = reducer(sliceInitialState, {
      type: userOrdersThunk.pending.type
    });
    expect(state.isLoad).toBe(true);
  });

  it('fulfilled writes data', () => {
    const state = reducer(sliceInitialState, {
      type: userOrdersThunk.fulfilled.type,
      payload: [order]
    });
    expect(state.isLoad).toBe(false);
    expect(state.userOrders).toEqual([order]);
  });

  it('rejected clears load', () => {
    const state = reducer(
      { ...sliceInitialState, isLoad: true },
      { type: userOrdersThunk.rejected.type }
    );
    expect(state.isLoad).toBe(false);
  });
});

describe('ordersSlice selectors', () => {
  const rootState = { orders: { isLoad: false, userOrders: [order] } };

  it('isload selector', () => {
    expect(isload(rootState)).toBe(false);
  });

  it('getUserOrders selector', () => {
    expect(getUserOrders(rootState)).toEqual([order]);
  });
});
