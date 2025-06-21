import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import aiReducer from "./slices/aiSlice"
import marketDataReducer from "./slices/marketDataSlice"
import learningReducer from "./slices/learningSlice"

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    ai: aiReducer,
    marketData: marketDataReducer,
    learning: learningReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
