import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import OnboardingModule1 from "./pages/OnboardingModule1";
import OnboardingModule2 from "./pages/OnboardingModule2";
import OnboardingModule3 from "./pages/OnboardingModule3";
import OnboardingModule4 from "./pages/OnboardingModule4";
import OnboardingModule5 from "./pages/OnboardingModule5";
import ProfileStudioIntro from "./pages/ProfileStudioIntro";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Discover from "./pages/Discover";
import Welcome from "./pages/Welcome";
import Interests from "./pages/Interests";
import Chat from "./pages/Chat";
import Expressions from "./pages/Expressions";
import Preview from "./pages/Preview";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EditCurrentProfile from "./pages/EditCurrentProfile";
import ManagePhotos from "./pages/ManagePhotos";
import DatingTips from "./pages/DatingTips";
import DatingTipDetail from "./pages/DatingTipDetail";
import HelpFAQ from "./pages/HelpFAQ";
import HelpCategory from "./pages/HelpCategory";
import HelpQuestion from "./pages/HelpQuestion";
import ContactSupport from "./pages/ContactSupport";
import Subscribe from "./pages/Subscribe";
import BuyExtras from "./pages/BuyExtras";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/onboarding-module-1" element={<OnboardingModule1 />} />
          <Route path="/onboarding-module-2" element={<OnboardingModule2 />} />
          <Route path="/onboarding-module-3" element={<OnboardingModule3 />} />
          <Route path="/onboarding-module-4" element={<OnboardingModule4 />} />
          <Route path="/onboarding-module-5" element={<OnboardingModule5 />} />
          <Route path="/profile-studio-intro" element={<ProfileStudioIntro />} />
          <Route path="/create" element={<Index />} />
          <Route path="/results" element={<Results />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/moments" element={<Expressions />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/edit-current-profile" element={<EditCurrentProfile />} />
          <Route path="/manage-photos" element={<ManagePhotos />} />
          <Route path="/dating-tips" element={<DatingTips />} />
          <Route path="/dating-tips/:slug" element={<DatingTipDetail />} />
          <Route path="/help-faq" element={<HelpFAQ />} />
          <Route path="/help-faq/:slug" element={<HelpCategory />} />
          <Route path="/help-faq/:slug/:questionIndex" element={<HelpQuestion />} />
          <Route path="/contact-support" element={<ContactSupport />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/buy-extras" element={<BuyExtras />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
