import { AppRouter } from "./routes/AppRouter";
import { useAuthInitializer } from "./hooks/useAuthInitializer";

export default function App() {
  useAuthInitializer();

  return <AppRouter />;
}
