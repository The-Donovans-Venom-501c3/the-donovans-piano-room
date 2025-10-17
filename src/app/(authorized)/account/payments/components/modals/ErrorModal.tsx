import Modal from "./Modal";
import Button4 from "@/components/atoms/Button4";
import { Close } from "@mui/icons-material";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

/**
 * A simple modal to display an error message to the user.
 */
export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex w-full min-w-[400px] flex-col justify-between gap-[12px] rounded-[12px] bg-[#FCEBDD] p-5">
        <div className="flex w-full justify-end">
          <button
            onClick={onClose}
            className="-mt-1 p-1"
            aria-label="Close error modal"
          >
            <Close fontSize="large" />
          </button>
        </div>
        <div className="flex w-full flex-col gap-2">
          <h2 className="text-center text-[20px] font-semibold leading-[28px]">
            Error
          </h2>
          <p className="px-2 py-3 text-center text-[16px] font-normal leading-[24px]">
            {message}
          </p>
        </div>
        <div className="flex w-full justify-center">
          <Button4
            text="Ok"
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: "3%",
              height: "40px",
              fontWeight: "bold",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}