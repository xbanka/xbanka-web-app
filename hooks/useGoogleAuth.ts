export const useGoogleAuth = () => {
  const loginWithGoogle = (action: "signin" | "signup" = "signin") => {
    const redirectUrl = `${window.location.origin}/auth/google/callback?action=${action}`;

    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect_url=${encodeURIComponent(
        redirectUrl
      )}`;
  };

  return { loginWithGoogle };
};