import { useAuthInitializer } from "./hooks/useAuthInitializer";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "./router/AppRouter";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  useAuthInitializer();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
