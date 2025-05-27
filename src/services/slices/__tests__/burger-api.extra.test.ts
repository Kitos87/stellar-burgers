jest.mock('@cookie', () => ({
  getCookie: jest.fn().mockReturnValue('Bearer X'),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('burger-api helpers – extended coverage', () => {
  const URL = 'https://example.com';
  let api: typeof import('@api');

  beforeEach(() => {
    jest.resetModules();
    process.env.BURGER_API_URL = URL;
    (global.fetch as any) = jest.fn();
    localStorage.clear();
    api = require('@api');
  });

  it('checkResponse rejects on !ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: true })
    });

    await expect(api.getIngredientsApi()).rejects.toEqual({ error: true });
  });

  it('getFeedsApi resolves with full payload', async () => {
    const payload = { success: true, orders: [], total: 1, totalToday: 1 };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(payload)
    });

    const data = await api.getFeedsApi();
    expect(data).toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(`${URL}/orders/all`);
  });

  it('getFeedsApi rejects when success false', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false })
    });

    await expect(api.getFeedsApi()).rejects.toEqual({ success: false });
  });

  it('getOrdersApi returns orders list', async () => {
    const spy = jest.spyOn(api, 'fetchWithRefresh').mockResolvedValue({
      success: true,
      orders: [{ number: 1 }]
    } as any);

    const res = await api.getOrdersApi();
    expect(res).toEqual([{ number: 1 }]);
    expect(spy).toHaveBeenCalledWith(
      `${URL}/orders`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getOrdersApi rejects on success=false', async () => {
    jest
      .spyOn(api, 'fetchWithRefresh')
      .mockResolvedValue({ success: false } as any);
    await expect(api.getOrdersApi()).rejects.toEqual({ success: false });
  });

  it('getOrderByNumberApi hits correct URL', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, orders: [] })
    });

    await api.getOrderByNumberApi(777);
    expect(fetch).toHaveBeenCalledWith(`${URL}/orders/777`, expect.any(Object));
  });

  const authSuccess = {
    success: true,
    accessToken: 'A',
    refreshToken: 'R',
    user: { email: 'x', name: 'y' }
  };
  it.each([
    ['registerUserApi', 'auth/register'],
    ['loginUserApi', 'auth/login']
  ])('%s resolves + passes body', async (fn, route) => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(authSuccess)
    });

    const data = await (api as any)[fn]({
      email: 'x',
      name: 'y',
      password: 'p'
    });
    expect(data).toEqual(authSuccess);
    expect(fetch).toHaveBeenCalledWith(
      `${URL}/${route}`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it.each([
    ['registerUserApi', 'auth/register'],
    ['loginUserApi', 'auth/login']
  ])('%s rejects when success false', async (fn, route) => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false })
    });

    await expect((api as any)[fn]({})).rejects.toEqual({ success: false });
  });

  it('forgotPasswordApi passes through success', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    const res = await api.forgotPasswordApi({ email: 'e' });
    expect(res.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `${URL}/password-reset`,
      expect.any(Object)
    );
  });

  it('resetPasswordApi passes through success', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    const res = await api.resetPasswordApi({ password: 'p', token: 't' });
    expect(res.success).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      `${URL}/password-reset/reset`,
      expect.any(Object)
    );
  });

  it('logoutApi posts refresh token', async () => {
    localStorage.setItem('refreshToken', 'STORED');
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    await api.logoutApi();
    const [[calledUrl, opts]] = (fetch as jest.Mock).mock.calls;
    expect(calledUrl).toBe(`${URL}/auth/logout`);
    expect(JSON.parse((opts as RequestInit).body as string).token).toBe(
      'STORED'
    );
  });
});
