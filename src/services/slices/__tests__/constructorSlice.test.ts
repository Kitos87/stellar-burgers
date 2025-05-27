import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveUp,
  moveDown,
  clearConstructor,
  BuyBurgerThunk,
  getConstructorIngredients,
  getStatusBuyBurger,
  getOrderData
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn().mockResolvedValue({ order: { number: 999 } })
}));

const reducer = constructorSlice.reducer;

const bun: TIngredient = {
  _id: '1',
  name: 'Bun',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: '',
  image_mobile: '',
  image_large: ''
};

const sauce: TIngredient = {
  _id: '2',
  name: 'Sauce',
  type: 'sauce',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructorSlice reducer', () => {
  it('adds bun', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.constructor.bun?.name).toBe('Bun');
    expect(state.constructor.ingredients).toHaveLength(0);
  });

  it('adds ingredient', () => {
    const state = reducer(undefined, addIngredient(sauce));
    expect(state.constructor.ingredients[0]).toMatchObject({
      _id: '2',
      name: 'Sauce'
    });
    expect(state.constructor.bun).toBeNull();
  });

  it('removes ingredient', () => {
    const withIngredient = reducer(undefined, addIngredient(sauce));
    const id = withIngredient.constructor.ingredients[0].id;
    const removed = reducer(withIngredient, removeIngredient(id));
    expect(removed.constructor.ingredients).toHaveLength(0);
  });

  it('moveUp swaps ingredients', () => {
    const first = { ...sauce, _id: '3', name: 'One' };
    const second = { ...sauce, _id: '4', name: 'Two' };
    let state = reducer(undefined, addIngredient(first));
    state = reducer(state, addIngredient(second));
    state = reducer(state, moveUp(1));
    expect(state.constructor.ingredients[0]._id).toBe('4');
  });

  it('moveDown swaps ingredients', () => {
    const first = { ...sauce, _id: '5', name: 'One' };
    const second = { ...sauce, _id: '6', name: 'Two' };
    let state = reducer(undefined, addIngredient(first));
    state = reducer(state, addIngredient(second));
    state = reducer(state, moveDown(0));
    expect(state.constructor.ingredients[1]._id).toBe('5');
  });

  it('clears constructor', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, clearConstructor());
    expect(state.constructor.bun).toBeNull();
    expect(state.constructor.ingredients).toHaveLength(0);
    expect(state.orderData).toBeNull();
  });

  it('BuyBurgerThunk pending sets status', () => {
    const state = reducer(undefined, { type: BuyBurgerThunk.pending.type });
    expect(state.buyBurgerStatus).toBe(true);
  });

  it('BuyBurgerThunk fulfilled sets order and turns off status', () => {
    const fulfilled = {
      type: BuyBurgerThunk.fulfilled.type,
      payload: { order: { number: 1 } }
    };
    const pendingState = reducer(undefined, {
      type: BuyBurgerThunk.pending.type
    });
    const state = reducer(pendingState, fulfilled);
    expect(state.buyBurgerStatus).toBe(false);
    expect(state.orderData?.number).toBe(1);
  });

  it('BuyBurgerThunk rejected turns off status', () => {
    const pendingState = reducer(undefined, {
      type: BuyBurgerThunk.pending.type
    });
    const state = reducer(pendingState, { type: BuyBurgerThunk.rejected.type });
    expect(state.buyBurgerStatus).toBe(false);
  });

  it('selectors work', () => {
    const sliceState = reducer(undefined, addIngredient(bun));
    const rootState = { constructorIngredients: sliceState };
    expect(getConstructorIngredients(rootState)).toBe(sliceState.constructor);
    expect(getStatusBuyBurger(rootState)).toBe(false);
    expect(getOrderData(rootState)).toBeNull();
  });
});
