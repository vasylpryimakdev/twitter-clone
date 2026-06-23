import { useAuthInitializer } from "./hooks/useAuthInitializer";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./router/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  useAuthInitializer();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
