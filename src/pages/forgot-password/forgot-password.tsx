import { FC, useState, SyntheticEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      setError(null);
      forgotPasswordApi({ email })
        .then(() => {
          localStorage.setItem('resetPassword', 'true');
          navigate('/reset-password', { replace: true });
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err : new Error('Произошла ошибка');
          setError(errorMessage);
        });
    },
    [email, navigate]
  );

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};

export default ForgotPassword;
