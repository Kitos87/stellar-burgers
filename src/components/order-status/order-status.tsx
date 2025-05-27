import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusMap = {
  pending: { text: 'Готовится', color: '#E52B1A' },
  done: { text: 'Выполнен', color: '#00CCCC' },
  created: { text: 'Создан', color: '#F2F2F3' }
} as const;

type KnownStatus = keyof typeof statusMap;

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const { text, color } = (
    statusMap as Record<string, { text: string; color: string }>
  )[status] || {
    text: 'Неизвестно',
    color: '#999999'
  };

  return <OrderStatusUI text={text} textStyle={color} />;
};
