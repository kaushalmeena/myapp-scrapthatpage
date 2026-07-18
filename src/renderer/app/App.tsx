import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./store";
import ThemeProvider from "./ThemeProvider";
import router from "./router";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
