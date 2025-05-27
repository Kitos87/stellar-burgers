import { useAppSelector } from '@app-store';
import { getChekUser, getName } from '@slices';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouterProps = {
  children: React.ReactNode;
  isPublic?: boolean;
};

export function ProtectedRouter({
  children,
  isPublic = false
}: ProtectedRouterProps) {
  const location = useLocation();
  const userName = useAppSelector(getName);
  const isUserChecked = useAppSelector(getChekUser);

  if (!isUserChecked) return <Preloader />;
  if (!isPublic && !userName)
    return <Navigate to='/login' replace state={{ from: location }} />;
  if (isPublic && userName) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }
  return children;
}
