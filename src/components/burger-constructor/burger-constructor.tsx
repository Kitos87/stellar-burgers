import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrop } from 'react-dnd';

import { useAppDispatch, useAppSelector } from '@app-store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  BuyBurgerThunk,
  clearConstructor,
  getConstructorIngredients,
  getName,
  getOrderData,
  getStatusBuyBurger,
  addIngredient
} from '@slices';

const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const constructorItems = useAppSelector(getConstructorIngredients);
  const orderRequest = useAppSelector(getStatusBuyBurger);
  const userName = useAppSelector(getName);
  const orderModalData = useAppSelector(getOrderData);

  const onOrderClick = () => {
    if (!userName) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];
    dispatch(BuyBurgerThunk(ids));
  };
  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };
  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const [, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item: TIngredient) => {
      dispatch(addIngredient(item));
    }
  });

  return (
    <div ref={dropRef}>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </div>
  );
};

export default BurgerConstructor;
