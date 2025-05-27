jest.mock('@cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn().mockReturnValue('Bearer oldAccess'),
  deleteCookie: jest.fn()
}));

describe('burger-api helpers', () => {
  let api: typeof import('@api');
  let setCookieMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    process.env.BURGER_API_URL = 'https://example.com';
    (global.fetch as unknown) = jest.fn();
    localStorage.clear();

    api = require('@api');
    setCookieMock = require('@cookie').setCookie;
  });

  it('refreshToken stores new tokens and returns data', async () => {
    localStorage.setItem('refreshToken', 'oldRefresh');
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          refreshToken: 'newRefresh',
          accessToken: 'newAccess'
        })
    });

    const data = await api.refreshToken();

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/auth/token',
      expect.objectContaining({ method: 'POST' })
    );
    expect(localStorage.getItem('refreshToken')).toBe('newRefresh');
    expect(setCookieMock).toHaveBeenCalledWith('accessToken', 'newAccess');
    expect(data.accessToken).toBe('newAccess');
  });

  it('fetchWithRefresh returns data on first try', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, payload: 42 })
    });

    const res = await api.fetchWithRefresh<{
      success: boolean;
      payload: number;
    }>('any/url', { method: 'GET' });

    expect(res.payload).toBe(42);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('fetchWithRefresh refreshes token on jwt expired and retries', async () => {
    (fetch as jest.Mock)
      .mockRejectedValueOnce({ message: 'jwt expired' })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, value: 99 })
      });

    jest.spyOn(api, 'refreshToken').mockResolvedValue({
      success: true,
      refreshToken: 'newR',
      accessToken: 'refAccess'
    } as any);

    const options: RequestInit & { headers?: Record<string, string> } = {
      method: 'GET',
      headers: {}
    };

    const res = await api.fetchWithRefresh<{ success: boolean; value: number }>(
      'url',
      options
    );

    expect(res.value).toBe(99);
    expect(options.headers!.authorization).toBe('refAccess');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('fetchWithRefresh propagates non-auth errors', async () => {
    const err = { message: 'network down' };
    (fetch as jest.Mock).mockRejectedValue(err);

    await expect(
      api.fetchWithRefresh('url', { method: 'GET' })
    ).rejects.toEqual(err);
  });

  it('getIngredientsApi returns ingredient list', async () => {
    const fakeData = { success: true, data: [{ _id: '1' }], other: 0 };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fakeData)
    });

    const res = await api.getIngredientsApi();
    expect(res).toEqual(fakeData.data);
    expect(fetch).toHaveBeenCalledWith('https://example.com/ingredients');
  });

  it('getIngredientsApi rejects on unsuccessful flag', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false })
    });

    await expect(api.getIngredientsApi()).rejects.toEqual({ success: false });
  });

  it('orderBurgerApi sends ingredients and returns full response', async () => {
    const spy = jest.spyOn(api, 'fetchWithRefresh').mockResolvedValue({
      success: true,
      order: { number: 321 },
      name: 'done'
    } as any);

    const res = await api.orderBurgerApi(['id1', 'id2']);

    expect(spy).toHaveBeenCalledWith(
      'https://example.com/orders',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ ingredients: ['id1', 'id2'] })
      })
    );
    expect(res.order.number).toBe(321);
  });
});
