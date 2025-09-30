"use client";

import { useState, useEffect, SetStateAction } from "react";

// Foundational Imports
import {
  getPaymentMethods,
  deletePaymentMethod,
  addCardPaymentMethod,
  updatePaymentMethod,
  addBankPaymentMethod,
} from "@/lib/api/paymentService";
import {
  Method,
  MethodType,
  CardData,
  BankAccountData,
} from "@/interfaces/paymentInterface";

// Layout & Wrapper Components
import AuthorizedWrapper1 from "@/components/ContentWrappers/authorized-1/AuthorizedWrapper1";
import AccountAndSettingsNav from "@/components/atoms/AccountAndSettingsNav";
import { authorizedWrapperTitles, settingsNavigation } from "@/utils/general";

// Page-specific Components
import Header from "./components/Header";
import SavedPaymentList from "./components/SavedPaymentList";
import AddPaymentMethodOptions from "./components/AddPaymentMethodOptions";
import DeleteConfirmationModal from "./components/modals/DeleteConfirmationModal";
import PaymentMethodModal, {
  FormDataType,
  FormMode,
} from "./components/modals/PaymentMethodModal";
import ErrorModal from "./components/modals/ErrorModal";

export default function PaymentMethodsPage() {
  // --- State Management ---
  const [items, setItems] = useState<Method[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState<string | null>(null);

  // State for controlling modals
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("ADD");
  const [formType, setFormType] = useState<MethodType | null>(null);
  const [methodToEdit, setMethodToEdit] = useState<Method | null>(null);

  // --- Data Fetching ---
  const loadPaymentMethods = async () => {
    setIsLoading(true);
    const { data, ok, error } = await getPaymentMethods();
    if (ok && data) {
      setItems(data);
    } else {
      setShowError(error || "Failed to load payment methods.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  // --- Handlers for Child Components ---

  const handleOpenAddModal = (type: MethodType) => {
    setFormMode("ADD");
    setFormType(type);
    setMethodToEdit(null);
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (method: Method) => {
    setFormMode("EDIT");
    setFormType(method.type);
    setMethodToEdit(method);
    setShowAddEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddEditModal(false);
    setMethodToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!methodToDelete) return;

    const { ok } = await deletePaymentMethod(methodToDelete.id);
    if (ok) {
      await loadPaymentMethods();
      handleCloseModals();
    } else {
      setShowError("Could not delete payment method.");
    }
  };

  // --- Form Submission Handler ---
  const handleFormSubmit = async (
    data: FormDataType | any,
    isDefault: boolean,
    originalId?: string,
  ) => {
    let response;

    // --- UPDATE existing payment method ---
    // If an originalId is provided, we know it's an edit.
    if (originalId) {
      response = await updatePaymentMethod(originalId, {
        billingAddress: data.billing_address,
        setAsDefault: isDefault,
      });

      // --- ADD new payment method ---
    } else {
      // Use a type guard to check if the payload is for a Card
      if ("number" in data) {
        response = await addCardPaymentMethod(data as CardData, isDefault);

        // Check if the payload is for a Bank Account
      } else if ("account_number" in data) {
        response = await addBankPaymentMethod(
          data as BankAccountData,
          isDefault,
        );
      }
    }

    // --- Handle the API response ---
    // This block runs after the API call is complete.
    if (response && response.ok) {
      // On success, refresh the list and close the modal.
      await loadPaymentMethods();
      handleCloseModals();
    } else {
      // On failure, show the error message from the API.
      setShowError(response?.error || "Failed to save payment method.");
    }
  };

  return (
    <AuthorizedWrapper1 pageTitle={authorizedWrapperTitles.AccountAndSettings}>
      <AccountAndSettingsNav currentPage={settingsNavigation.paymentMethods} />
      <div className="relative mt-[1%] h-[85%] w-full overflow-y-auto">
        <div className="flex w-full flex-col justify-between gap-8 pb-10">
          <Header />

          <SavedPaymentList
            items={items}
            onEdit={handleOpenEditModal}
            onDelete={(method: SetStateAction<Method | null>) =>
              setMethodToDelete(method)
            }
          />

          <AddPaymentMethodOptions onSelect={handleOpenAddModal} />
        </div>
      </div>

      {/* MODALS RENDERED HERE */}

      <DeleteConfirmationModal
        methodToDelete={methodToDelete}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
      />

      {showAddEditModal && (
        <PaymentMethodModal
          mode={formMode}
          type={formType}
          methodToEdit={methodToEdit}
          onClose={handleCloseModals}
          onSubmit={handleFormSubmit}
          onError={setShowError}
        />
      )}

      {/* RENDER THE ERROR MODAL WHEN showError HAS A MESSAGE */}
      {showError && (
        <ErrorModal message={showError} onClose={() => setShowError(null)} />
      )}
    </AuthorizedWrapper1>
  );
}
