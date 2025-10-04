import { Method } from "@/interfaces/paymentInterface";
import Button4 from "@/components/atoms/Button4";
import { Close } from "@mui/icons-material";
import Modal from "./Modal";

interface DeleteConfirmationModalProps {
  methodToDelete: Method | null;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmationModal({
  methodToDelete,
  onConfirm,
  onClose,
}: DeleteConfirmationModalProps) {
  // If there's no method to delete, don't render anything.
  if (!methodToDelete) {
    return null;
  }

  // Determine the display details from the method object.
  const brand = methodToDelete.card?.brand || "payment method";
  const last4 = methodToDelete.card?.last4 || "****";

  return (
    <Modal onClose={onClose}>
      <div className="flex w-full min-w-[450px] flex-col justify-between gap-[12px] rounded-[12px] bg-[#FCEBDD] p-10">
        {/* Header Area */}
        <div className="flex w-full justify-end">
          <button
            onClick={onClose}
            className="-mt-1 p-1"
            aria-label="Close delete modal"
          >
            <Close fontSize="large" />
          </button>
        </div>

        {/* Body Text */}
        <div className="flex w-full flex-col gap-2">
          <h2 className="text-center text-[20px] font-semibold leading-[28px]">
            Delete payment method
          </h2>
          <p className="px-2 py-3 text-center text-[16px] font-normal leading-[24px]">
            Are you sure you want to delete the {brand} ending in{" "}
            <span className="font-semibold text-[#DA6A1C]">{last4}</span>?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full justify-center gap-4 pt-4">
          <Button4
            text="Cancel"
            onClick={onClose}
            style={{
              width: "48%",
              height: "40px",
              fontSize: "16px",
            }}
          />
          <Button4
            text="Yes, delete"
            onClick={onConfirm}
            style={{
              width: "48%",
              height: "40px",
              fontSize: "16px",
              backgroundColor: "#B3261E",
              color: "white",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
