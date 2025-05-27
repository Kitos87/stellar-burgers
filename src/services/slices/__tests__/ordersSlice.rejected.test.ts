import { ordersSlice, userOrdersThunk } from '../orderSlice';
import { TOrder } from '@utils-types';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const reducer = ordersSlice.reducer;

const mockOrder: TOrder = {
  _id: '1',
  name: 'Order',
  ingredients: [],
  status: 'done',
  number: 1,
  createdAt: '',
  updatedAt: ''
};

it('userOrdersThunk.rejected drops isLoad flag but preserves list', () => {
  const startState: ReturnType<typeof reducer> = {
    ...ordersSlice.getInitialState(),
    isLoad: true,
    userOrders: [mockOrder]
  };

  const next = reducer(startState, { type: userOrdersThunk.rejected.type });

  expect(next.isLoad).toBe(false);
  expect(next.userOrders).toEqual([mockOrder]);
});
