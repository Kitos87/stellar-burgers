import { rootReducer } from '@app-store';

describe('rootReducer', () => {
  it('returns initial state object with expected keys', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toHaveProperty('constructorIngredients');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
  });
});
