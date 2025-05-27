import { setCookie, getCookie, deleteCookie } from '@cookie';

beforeEach(() => {
  Object.defineProperty(document, 'cookie', { value: '', writable: true });
});

describe('cookie utils', () => {
  it('sets and gets cookie', () => {
    setCookie('token', 'abc');
    expect(document.cookie).toContain('token=abc');
    expect(getCookie('token')).toBe('abc');
  });

  it('deletes cookie', () => {
    setCookie('token', 'abc');
    deleteCookie('token');
    expect(getCookie('token')).toBe('');
  });
});
