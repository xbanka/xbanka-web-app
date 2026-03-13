export const useGoogleAuth = () => {
  const loginWithGoogle = () => {
    const redirectUrl = `${window.location.origin}/auth/google/callback`;

    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google?redirect_url=${encodeURIComponent(
        redirectUrl
      )}`;
  };

  return { loginWithGoogle };
};