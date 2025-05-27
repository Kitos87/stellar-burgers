import { FC, memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@app-store';
import { getIngredients } from '@slices';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(getIngredients);

  const ingredient = useMemo(
    () => ingredients.find((i) => i._id === id),
    [ingredients, id]
  );

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};

export default memo(IngredientDetails);
