import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrag } from 'react-dnd';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useAppDispatch } from '@app-store';
import { addIngredient } from '@slices';

const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient,
  count
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleAdd = () => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-testid='ingredient-item'
    >
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    </div>
  );
};

export default memo(BurgerIngredient);
