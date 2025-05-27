import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@app-store';
import { getIngredients, getOrders } from '@slices';

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

export const OrderInfo: FC = () => {
  const url = useParams();
  const ingredients: TIngredient[] = useAppSelector(getIngredients);
  const orders = useAppSelector(getOrders);
  const orderData = orders.find((order) => order.number === Number(url.number));

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    const formattedDate = formatRelativeDate(date);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      formattedDate,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
