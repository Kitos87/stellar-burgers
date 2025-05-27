import {
  ingredientsSlice,
  IngredientsThunk,
  getIngredients,
  ingredientstIsLoading
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const reducer = ingredientsSlice.reducer;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const initialState = { ingredients: [], loading: false, error: null };

const ing: TIngredient = {
  _id: '1',
  name: 'Ing',
  type: 'main',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('ingredientsSlice reducer', () => {
  it('pending sets loading', () => {
    const s = reducer(initialState, { type: IngredientsThunk.pending.type });
    expect(s.loading).toBe(true);
    expect(s.error).toBeNull();
  });

  it('fulfilled sets data', () => {
    const s = reducer(initialState, {
      type: IngredientsThunk.fulfilled.type,
      payload: [ing]
    });
    expect(s.loading).toBe(false);
    expect(s.ingredients).toEqual([ing]);
  });

  it('rejected stops loading', () => {
    const s = reducer(
      { ...initialState, loading: true },
      { type: IngredientsThunk.rejected.type }
    );
    expect(s.loading).toBe(false);
  });
});

describe('ingredientsSlice selectors', () => {
  const state = {
    ingredients: { ingredients: [ing], loading: false, error: null }
  };
  it('getIngredients returns list', () => {
    expect(getIngredients(state)).toHaveLength(1);
  });
  it('ingredientstIsLoading returns flag', () => {
    expect(ingredientstIsLoading(state)).toBe(false);
  });
});
