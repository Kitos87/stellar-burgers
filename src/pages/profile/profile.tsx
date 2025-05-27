import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@app-store';
import { getEmail, getName, updateUser } from '@slices';
import { ProfileUI } from '@ui-pages';

const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const userName = useAppSelector(getName);
  const userEmail = useAppSelector(getEmail);

  const [initialFormValue, setInitialFormValue] = useState({
    name: userName || '',
    email: userEmail || ''
  });

  const [formValue, setFormValue] = useState({
    name: userName || '',
    email: userEmail || '',
    password: ''
  });

  useEffect(() => {
    const name = userName || '';
    const email = userEmail || '';
    setFormValue((prev) => ({
      ...prev,
      name,
      email
    }));
    setInitialFormValue({ name, email });
  }, [userName, userEmail]);

  const isFormChanged =
    formValue.name !== initialFormValue.name ||
    formValue.email !== initialFormValue.email ||
    !!formValue.password;

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(updateUser(formValue));
    },
    [dispatch, formValue]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        ...initialFormValue,
        password: ''
      });
    },
    [initialFormValue]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValue((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    []
  );

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};

export default Profile;
