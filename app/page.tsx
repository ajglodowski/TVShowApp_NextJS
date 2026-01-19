import Home from "./components/home/Home";
import LandingPage from "./components/LandingPage";
import { getCurrentUserId } from "./utils/supabase/server";

export default async function Index() {
  const currentUserId = await getCurrentUserId();

  // Show landing page for non-authenticated users
  if (!currentUserId) {
    return <LandingPage />;
  }

  return (
    <div className="w-full">
      <Home />
    </div>
  );
}
