import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// For shadcn/ui and radix
export function cn (...inputs){
    return twMerge(clsx(inputs));
}