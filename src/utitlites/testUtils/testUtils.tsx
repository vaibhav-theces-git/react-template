import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "src/common/components/SnackBarUtilsConfigurator";
import { AppStore, RootState, setupStore } from "src/store";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}
const queryCache = new QueryCache();

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const Wrapper = ({
    children,
  }: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SnackbarUtilsConfigurator />

        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </Provider>
      </SnackbarProvider>
    );
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export { queryCache };
