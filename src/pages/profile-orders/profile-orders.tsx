import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@app-store';
import { getUserOrders, userOrdersThunk, isload } from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(getUserOrders);
  const isLoading: boolean = useAppSelector(isload);

  useEffect(() => {
    dispatch(userOrdersThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
