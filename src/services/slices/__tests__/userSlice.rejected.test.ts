import {
  userSlice,
  getUser,
  register,
  login,
  logout,
  updateUser
} from '../userSlice';

const reducer = userSlice.reducer;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const base = { email: '', name: '', checkUser: false };

describe('userSlice rejected branches', () => {
  it.each([
    getUser.rejected.type,
    register.rejected.type,
    login.rejected.type,
    logout.rejected.type,
    updateUser.rejected.type
  ])('%s keeps state unchanged & turns off side-effects', (type) => {
    localStorage.setItem('refreshToken', 'X');
    const state = reducer(base, { type });
    expect(state).toEqual(base);
    expect(localStorage.getItem('refreshToken')).toBe('X');
  });
});
