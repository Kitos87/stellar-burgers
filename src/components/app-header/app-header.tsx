import { FC, memo } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '@app-store';
import { getName } from '@slices';

const AppHeader: FC = () => {
  const userName = useAppSelector(getName);
  return <AppHeaderUI userName={userName} />;
};

export default memo(AppHeader);
