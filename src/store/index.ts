// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as DASHBOARD } from './Dashboard/slice';
import { reducer as AUTH } from './Auths/slice';

const rootReducer = combineReducers({
  dashboardData: DASHBOARD,
  authData: AUTH
});

const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
