import { Method, Brand } from "@/interfaces/paymentInterface";
import { Edit, DeleteOutline } from "@mui/icons-material";
import Image from "next/image";

// A small, specialized component to display the card brand's logo.
// It's co-located here because it's only used by the SavedPaymentList.
function BrandBadge({ brand }: { brand: Brand }) {
  const brandLogos: Partial<Record<Brand, string>> = {
    VISA: "Visa.svg",
    MASTERCARD: "Mastercard.svg",
    AMEX: "Amex.svg",
    DISCOVER: "Discover.svg",
  };

  const logoSrc = brandLogos[brand] || "CreditCard.svg";

  return (
    <Image
      src={`/account/payments/${logoSrc}`}
      alt={`${brand} logo`}
      width={45}
      height={30}
      aria-hidden="true"
    />
  );
}

interface SavedPaymentListProps {
  items: Method[];
  onEdit: (method: Method) => void;
  onDelete: (method: Method) => void;
}

export default function SavedPaymentList({
  items,
  onEdit,
  onDelete,
}: SavedPaymentListProps) {
  return (
    <div>
      <div className="mb-3 text-[16px] font-semibold text-[#5C3B1E]">
        Saved payment methods
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          // Display a message if there are no saved methods
          <p className="text-gray-500">You have no saved payment methods.</p>
        ) : (
          // Map over the items to display each one
          items.map((method) => (
            <div
              key={method.id}
              className="flex h-[53px] w-[694px] items-center justify-between rounded-[12px] border-2 border-[#FCF0D8] bg-[#FEF8EE] p-4 shadow-[2px_2px_4px_0px_#AC7A2280]"
            >
              <div className="flex items-center gap-3">
                <BrandBadge brand={method.card?.brand || "OTHER"} />
                <div className="text-[16px] font-medium text-[#3C2A1A]">
                  {method.label}
                </div>
                {method.isDefault && (
                  <span className="ml-2 inline-flex items-center gap-2 text-[16px] font-bold leading-6 text-[#2E7D32]">
                    <Image
                      src="/account/payments/DefaultPayment.svg"
                      alt="Default Payment Method"
                      width={18}
                      height={18}
                    />
                    Used for Membership Auto Pay
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onEdit(method)}
                  className="text-[#6F2DBD] hover:opacity-80"
                  aria-label={`Edit ${method.label}`}
                  title="Edit"
                >
                  <Edit fontSize="large" />
                </button>
                <button
                  onClick={() => onDelete(method)}
                  className="text-[#6F2DBD] hover:opacity-80"
                  aria-label={`Delete ${method.label}`}
                  title="Delete"
                >
                  <DeleteOutline fontSize="large" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
