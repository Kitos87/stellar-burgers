import { useState, useRef, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useAppSelector } from '@app-store';
import { getIngredients } from '@slices';

function BurgerIngredients() {
  const ingredients = useAppSelector(getIngredients);

  const categorizedIngredients = useMemo(
    () =>
      ingredients.reduce<{ [key: string]: TIngredient[] }>(
        (acc, ingredient) => {
          if (!acc[ingredient.type]) {
            acc[ingredient.type] = [];
          }
          acc[ingredient.type].push(ingredient);
          return acc;
        },
        {}
      ),
    [ingredients]
  );

  const buns = categorizedIngredients.bun || [];
  const mains = categorizedIngredients.main || [];
  const sauces = categorizedIngredients.sauce || [];

  const [activeTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    const type = tab as TTabMode;
    setCurrentTab(type);
    if (type === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (type === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (type === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
}

export default BurgerIngredients;
