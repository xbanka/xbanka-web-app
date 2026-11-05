import SignUp from "@/components/auth/sign-up";
import React from "react";

const page = () => {
  return (
    <div className="bg-background min-h-dvh grid place-items-center px-4 py-10 max-sm:block max-sm:p-0">
      <SignUp />
    </div>
  );
};

export default page;
