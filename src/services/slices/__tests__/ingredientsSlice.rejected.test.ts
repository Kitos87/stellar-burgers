import { ingredientsSlice, IngredientsThunk } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const reducer = ingredientsSlice.reducer;

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Test',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: '',
  image_mobile: '',
  image_large: ''
};

it('IngredientsThunk.rejected sets loading=false and keeps list', () => {
  const startState = {
    ...ingredientsSlice.getInitialState(),
    ingredients: [mockIngredient],
    loading: true
  } as ReturnType<typeof reducer>;

  const next = reducer(startState, { type: IngredientsThunk.rejected.type });

  expect(next.loading).toBe(false);
  expect(next.ingredients).toEqual([mockIngredient]);
});
