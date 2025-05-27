import { FC, memo, useMemo } from 'react';
import { useAppSelector } from '@app-store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getOrders as selOrders, getTotal, getTotalToday } from '@slices';

const selectOrderNumbers = (orders: TOrder[], status: string) =>
  orders
    .filter((o) => o.status === status)
    .map((o) => o.number)
    .slice(0, 20);

const FeedInfo: FC = () => {
  const orders = useAppSelector(selOrders);
  const total = useAppSelector(getTotal);
  const totalToday = useAppSelector(getTotalToday);

  const readyOrders = useMemo(
    () => selectOrderNumbers(orders, 'done'),
    [orders]
  );
  const pendingOrders = useMemo(
    () => selectOrderNumbers(orders, 'pending'),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};

export default memo(FeedInfo);
