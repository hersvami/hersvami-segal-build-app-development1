import { cn } from '../utils/helpers';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return <div className={cn('animate-spin rounded-full border-2 border-blue-600 border-t-transparent', sizeClass)} />;
}
