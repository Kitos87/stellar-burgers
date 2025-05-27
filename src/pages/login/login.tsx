import { FC, SyntheticEvent, useState, useCallback } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '@app-store';
import { login } from '@slices';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setError(null);

      dispatch(login({ email, password }))
        .unwrap()
        .catch((err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : 'Ошибка входа. Проверьте данные.';
          setError(message);
        });
    },
    [dispatch, email, password]
  );

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
