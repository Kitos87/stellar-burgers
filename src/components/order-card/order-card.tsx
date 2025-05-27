import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@app-store';
import { getIngredients } from '@slices';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { OrderCardProps } from './type';

const MAX_INGREDIENTS = 6;

const formatRelativeDate = (date: Date): string => {
  const DAY = 1000 * 60 * 60 * 24;
  const now = new Date();
  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - date.getTime()) / DAY)
  );
  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  if (diffDays === 0) return `Сегодня, ${time}`;
  if (diffDays === 1) return `Вчера, ${time}`;
  return `${diffDays} ${getPluralDays(diffDays)} назад, ${time}`;
};

const getPluralDays = (n: number): string => {
  const lastDigit = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
};

const OrderCard = ({ order }: OrderCardProps) => {
  const location = useLocation();
  const ingredients = useAppSelector(getIngredients);

  const dict = useMemo(
    () =>
      ingredients.reduce<Record<string, TIngredient>>(
        (acc, i) => ({ ...acc, [i._id]: i }),
        {}
      ),
    [ingredients]
  );

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const list = order.ingredients
      .map((id) => dict[id])
      .filter(Boolean) as TIngredient[];

    const total = list.reduce((s, i) => s + i.price, 0);
    const date = new Date(order.createdAt);
    const formattedDate = formatRelativeDate(date);

    return {
      ...order,
      ingredientsInfo: list,
      ingredientsToShow: list.slice(0, MAX_INGREDIENTS),
      remains: Math.max(list.length - MAX_INGREDIENTS, 0),
      total,
      date,
      formattedDate
    };
  }, [order, ingredients, dict]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
};

export default memo(OrderCard);
