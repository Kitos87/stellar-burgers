import { forwardRef, useMemo } from 'react';
import { useAppSelector } from '@app-store';
import { getConstructorIngredients } from '@slices';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorItems } = useAppSelector(
    getConstructorIngredients
  );

  const counters = useMemo(() => {
    const map: Record<string, number> = {};

    constructorItems.forEach((item: TIngredient) => {
      map[item._id] = (map[item._id] || 0) + 1;
    });

    if (bun) map[bun._id] = 2;
    return map;
  }, [bun, constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={counters}
      ref={ref}
    />
  );
});
