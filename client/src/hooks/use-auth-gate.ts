import { useState } from "react";

export function useAuthGate() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

  const requireAuth = (action: () => void) => {
    if (isLoggedIn()) {
      action();
    } else {
      setShowLoginModal(true);
    }
  };

  return { showLoginModal, setShowLoginModal, requireAuth, isLoggedIn };
}
