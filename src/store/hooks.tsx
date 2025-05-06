// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use these hooks in your components instead of the plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface State {
    response: any;
    loading: boolean;
    message: string | null;
    status:boolean | null;
   
  }
export const empty:State={ response:null,loading:false, message: '', status: null };

