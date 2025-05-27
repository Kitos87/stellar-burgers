import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '@app-store';
import { removeIngredient, moveUp, moveDown } from '@slices';

const BurgerConstructorElement: FC<BurgerConstructorElementProps> = ({
  ingredient,
  index,
  totalItems
}) => {
  const dispatch = useAppDispatch();

  const handleMoveDown = useCallback(() => {
    dispatch(moveDown(index));
  }, [dispatch, index]);

  const handleMoveUp = useCallback(() => {
    dispatch(moveUp(index));
  }, [dispatch, index]);

  const handleClose = useCallback(() => {
    dispatch(removeIngredient(ingredient.id));
  }, [dispatch, ingredient.id]);

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
};

export default memo(BurgerConstructorElement);
