import {
  userSlice,
  setUserCheck,
  getName,
  getEmail,
  getChekUser,
  getUser,
  register,
  login,
  logout,
  updateUser
} from '../userSlice';

const reducer = userSlice.reducer;

const setCookieMock = jest.fn();
const deleteCookieMock = jest.fn();

jest.mock('@cookie', () => ({
  setCookie: (...args: unknown[]) => (setCookieMock as any)(...args),
  deleteCookie: (...args: unknown[]) => (deleteCookieMock as any)(...args)
}));

beforeEach(() => {
  setCookieMock.mockClear();
  deleteCookieMock.mockClear();
  localStorage.clear();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

const sliceInitialState = { email: '', name: '', checkUser: false };

const userPayload = { user: { email: 'e@mail.com', name: 'Name' } };
const authPayload = { ...userPayload, accessToken: 'A', refreshToken: 'R' };

describe('userSlice reducer', () => {
  it('setUserCheck sets flag', () => {
    const state = reducer(sliceInitialState, setUserCheck());
    expect(state.checkUser).toBe(true);
  });

  it('getUser fulfilled writes user', () => {
    const state = reducer(sliceInitialState, {
      type: getUser.fulfilled.type,
      payload: userPayload
    });
    expect(state.email).toBe('e@mail.com');
    expect(state.name).toBe('Name');
  });

  it('register fulfilled writes user and sets cookie', () => {
    const state = reducer(sliceInitialState, {
      type: register.fulfilled.type,
      payload: authPayload
    });
    expect(state.email).toBe('e@mail.com');
    expect(setCookieMock).toHaveBeenCalledWith('accessToken', 'A');
    expect(localStorage.getItem('refreshToken')).toBe('R');
  });

  it('login fulfilled writes user and sets cookie', () => {
    const state = reducer(sliceInitialState, {
      type: login.fulfilled.type,
      payload: authPayload
    });
    expect(state.name).toBe('Name');
    expect(setCookieMock).toHaveBeenCalledWith('accessToken', 'A');
  });

  it('logout fulfilled clears user and removes cookie', () => {
    const logged = reducer(sliceInitialState, {
      type: login.fulfilled.type,
      payload: authPayload
    });
    const cleared = reducer(logged, { type: logout.fulfilled.type });
    expect(cleared.email).toBe('');
    expect(deleteCookieMock).toHaveBeenCalledWith('accessToken');
  });

  it('updateUser fulfilled updates user', () => {
    const start = { email: 'old@mail.com', name: 'Old', checkUser: false };
    const state = reducer(start, {
      type: updateUser.fulfilled.type,
      payload: userPayload
    });
    expect(state.name).toBe('Name');
  });
});

describe('userSlice selectors', () => {
  const rootState = {
    user: { name: 'Sel', email: 'sel@mail.com', checkUser: true }
  };

  it('getName returns value', () => {
    expect(getName(rootState)).toBe('Sel');
  });

  it('getEmail returns value', () => {
    expect(getEmail(rootState)).toBe('sel@mail.com');
  });

  it('getChekUser returns flag', () => {
    expect(getChekUser(rootState)).toBe(true);
  });
});
