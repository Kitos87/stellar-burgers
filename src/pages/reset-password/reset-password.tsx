import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setError(null);
      resetPasswordApi({ password, token })
        .then(() => {
          localStorage.removeItem('resetPassword');
          navigate('/login');
        })
        .catch((err) => setError(err));
    },
    [password, token, navigate]
  );

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};

export default ResetPassword;
