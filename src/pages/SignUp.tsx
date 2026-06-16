import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import bg from "@/assets/signup-couple.png";

type LegalDoc = { title: string; url: string } | null;
const Legal = ({ onOpen }: { onOpen: (doc: LegalDoc) => void }) => {
  const link = "underline cursor-pointer";
  return (
    <p className="font-body text-[13px] leading-relaxed text-white/90 text-center px-2">
      By creating an account or signing in, you agree to
      <br />
      our <button type="button" className={link} onClick={() => onOpen({ title: "Terms of Service", url: "https://elyxwebsite01.lovable.app/terms" })}>Terms of Service.</button> Learn more on how we use
      <br />
      your data in our <button type="button" className={link} onClick={() => onOpen({ title: "Privacy Policy", url: "https://elyxwebsite01.lovable.app/privacy" })}>Privacy Policy</button> and{" "}
      <button type="button" className={link} onClick={() => onOpen({ title: "Cookies Policy", url: "https://elyxwebsite01.lovable.app/cookie-policy" })}>Cookies Policy.</button>
    </p>
  );
};



const SignUp = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);

  const handlePhone = () => navigate("/onboarding-module-1");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 pt-16 pb-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1
            className="text-white text-[56px] leading-none italic"
            style={{ fontFamily: "'Marcellus', serif", fontWeight: 400 }}
          >
            Elyxer
          </h1>
          <p
            className="mt-3 text-white/95 text-[18px]"
            style={{ fontFamily: "'EB Garamond', serif", fontWeight: 400 }}
          >
            "Dating Redefined"
          </p>
        </motion.div>

        {/* Bottom panel */}
        <div className="mt-auto flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!showOptions ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <Legal onOpen={setLegalDoc} />
                <Button
                  onClick={() => setShowOptions(true)}
                  className="w-full h-14 rounded-2xl font-body text-[16px] font-semibold text-primary-foreground"
                  style={{
                    background: "var(--gradient-gold)",
                    boxShadow: "var(--shadow-warm)",
                  }}
                >
                  Create my account
                </Button>
                <button
                  onClick={() => setShowOptions(true)}
                  className="font-body text-white text-[16px] font-semibold text-center"
                >
                  Sign in
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <button
                  onClick={handlePhone}
                  className="w-full h-14 rounded-2xl bg-white flex items-center justify-center gap-3 font-body text-[16px] font-semibold text-black shadow-lg"
                >
                  <Apple className="h-5 w-5 fill-black" />
                  Sign in with  Apple
                </button>
                <button
                  onClick={handlePhone}
                  className="w-full h-14 rounded-2xl bg-white flex items-center justify-center gap-3 font-body text-[16px] font-semibold text-black shadow-lg"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.7 2.4 12 2.4 6.8 2.4 2.6 6.6 2.6 11.8s4.2 9.4 9.4 9.4c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"/>
                    <path fill="#FBBC05" d="M3.5 7.5l3.2 2.3C7.6 7.7 9.6 6.3 12 6.3c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.5 14.7 2.6 12 2.6 8.1 2.6 4.7 4.6 3.5 7.5z"/>
                    <path fill="#34A853" d="M12 21.4c2.7 0 4.9-.9 6.5-2.4l-3.1-2.5c-.8.6-2 1.1-3.4 1.1-2.6 0-4.8-1.7-5.6-4.1l-3.2 2.5C4.6 19.3 8 21.4 12 21.4z"/>
                    <path fill="#4285F4" d="M21 12c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.3-1 2.4-2.1 3.1l3.1 2.5C20.4 18.2 21 15.3 21 12z"/>
                  </svg>
                  Sign in with  Google
                </button>
                <button
                  onClick={handlePhone}
                  className="w-full h-14 rounded-2xl font-body text-[16px] font-semibold text-primary-foreground"
                  style={{
                    background: "var(--gradient-gold)",
                    boxShadow: "var(--shadow-warm)",
                  }}
                >
                  Sign in with Phone number
                </button>
                <button
                  onClick={() => setShowOptions(false)}
                  className="font-body text-white text-[16px] font-semibold text-center mt-2"
                >
                  Back
                </button>
                <Legal onOpen={setLegalDoc} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={!!legalDoc} onOpenChange={(o) => !o && setLegalDoc(null)}>
        <DialogContent className="p-0 gap-0 overflow-hidden border-0 rounded-none sm:rounded-none w-screen h-[100dvh] max-w-none translate-x-[-50%] translate-y-[-50%] flex flex-col [&>button]:hidden">
          <div className="flex items-center justify-between px-4 h-12 border-b shrink-0 bg-background">
            <DialogTitle className="font-body text-[15px] font-semibold">
              {legalDoc?.title}
            </DialogTitle>
            <button
              onClick={() => setLegalDoc(null)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {legalDoc && (
            <iframe
              src={legalDoc.url}
              title={legalDoc.title}
              className="w-full flex-1 border-0 bg-background"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              referrerPolicy="no-referrer"
            />
          )}

        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;
