import { useAuthContext } from '@/contexts/auth-context';

export const useAuth = () => {
  const context = useAuthContext();
  return context;
};