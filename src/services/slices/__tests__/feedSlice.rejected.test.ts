import { feedSlice, FeedsThunk } from '../feedSlice';
import { TOrder } from '@utils-types';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const reducer = feedSlice.reducer;
const mockOrder: TOrder = {
  _id: '1',
  name: 'Order',
  ingredients: [],
  status: 'done',
  number: 1,
  createdAt: '',
  updatedAt: ''
};

it('FeedsThunk.rejected keeps existing feeds intact', () => {
  const startState: ReturnType<typeof reducer> = {
    ...feedSlice.getInitialState(),
    feeds: {
      orders: [mockOrder],
      total: 2,
      totalToday: 1
    }
  };

  const next = reducer(startState, { type: FeedsThunk.rejected.type });
  expect(next).toEqual(startState);
});
