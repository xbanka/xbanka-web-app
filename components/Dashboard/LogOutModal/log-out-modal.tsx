import { Button } from "@/components/ui/button";
import { FormHeader } from "@/components/ui/FormHeader";
import { Modal } from "@/components/ui/Modal";
import { tokenStore } from "@/store/token.store";
import { useRouter } from "next/navigation";

interface LogoutProps {
  onClose: () => void;
}

export const Logout = ({ onClose }: LogoutProps) => {
  const router = useRouter();

  const handleLogout = () => {
    tokenStore.clear();
    localStorage.removeItem("accessToken");

    onClose();
    router.push("/sign-in");
  };
  return (
    <Modal className="" onClose={onClose}>
      <FormHeader
        className="space-y-2 py-12 max-sm:text-[28px] max-sm:leading-[36px] tracking-[-4%]"
        title="Are you sure you want to logout?"
        subtitle="You will be logged out of your account"
      />
      <div className="flex flex-col md:flex-row gap-4 mt-1">
        <Button
          variant="outline"
          onClick={onClose}
          size="lg"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogout}
          size="lg"
          className="flex-3"
          type="submit"
        >
          Logout
        </Button>
      </div>
    </Modal>
  );
};
