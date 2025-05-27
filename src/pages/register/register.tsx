import { FC, useState, useCallback, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch } from '@app-store';
import { register } from '@slices';

const Register: FC = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!userName || !email || !password) {
        alert('Заполни все поля');
        return;
      }
      dispatch(register({ name: userName, email, password }));
    },
    [dispatch, userName, email, password]
  );

  return (
    <RegisterUI
      errorText=''
      userName={userName}
      email={email}
      password={password}
      setUserName={setUserName}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

export default Register;
