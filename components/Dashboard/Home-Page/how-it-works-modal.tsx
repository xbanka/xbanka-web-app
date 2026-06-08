import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/modal-header";
import React from "react";

export const HowItWorksModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
        className="px-8 "
        title="How it works"
        subtitle="This is how it works"
        onClose={onClose}
      />
      <div className="px-8 pt-4 pb-8 space-y-8">
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.</p>
      </div>
    </Modal>
  );
};
