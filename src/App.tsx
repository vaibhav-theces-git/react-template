import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "./common/components/SnackBarUtilsConfigurator";
import SideNavMenu from "./components/sidenavigation/SideNavMenu";
import { store } from "./store";

const App = () => {
  return (
    <div className="tw-h-full">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <SnackbarUtilsConfigurator />
        <Provider store={store}>
          <SideNavMenu />
        </Provider>
      </SnackbarProvider>
    </div>
  );
};
export default App;
