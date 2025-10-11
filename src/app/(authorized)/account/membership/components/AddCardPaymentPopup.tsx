"use client";
import { useState } from "react";
import Image from "next/image";

interface CardData {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddCardPaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (cardData: CardData) => void;
  loading?: boolean;
}

export default function AddCardPaymentPopup({
  isOpen,
  onClose,
  onAddCard,
  loading = false
}: AddCardPaymentPopupProps) {
  const [cardData, setCardData] = useState<CardData>({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US"
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CardData, string>>>({});

  if (!isOpen) return null;

  const validateCard = (): boolean => {
    const newErrors: Partial<Record<keyof CardData, string>> = {};

    // Card number (13-19 digits)
    if (!cardData.number.replace(/\s/g, '')) {
      newErrors.number = "Card number is required";
    } else if (!/^\d{13,19}$/.test(cardData.number.replace(/\s/g, ''))) {
      newErrors.number = "Invalid card number";
    }

    // Expiry (MM/YY format)
    if (!cardData.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = "Format: MM/YY";
    }

    // CVV (3-4 digits)
    if (!cardData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }

    // Name
    if (!cardData.name.trim()) {
      newErrors.name = "Cardholder name is required";
    }

    // Address
    if (!cardData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // City
    if (!cardData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State
    if (!cardData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Zip code
    if (!cardData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateCard()) {
      onAddCard(cardData);
    }
  };

  const handleClose = () => {
    setCardData({
      number: "",
      expiry: "",
      cvv: "",
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const inputClass = (hasError: boolean) => `w-full px-4 py-2 rounded-lg border-2 text-base ${
    hasError 
      ? 'border-red-500 focus:border-red-600' 
      : 'border-gray-300 focus:border-primary-purple'
  } focus:outline-none focus:ring-2 focus:ring-primary-purple focus:ring-opacity-20 disabled:bg-gray-100 disabled:cursor-not-allowed`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="text-xl relative bg-[#FFF2E5] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold text-black">Add Payment Method</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <Image src="/Close.svg" alt="Close" width={24} height={24} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Enter your card details. For testing, use: <strong>4005519200000004</strong>
        </p>

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label htmlFor="card-number" className="block font-medium text-black mb-1">
              Card Number
            </label>
            <input
              id="card-number"
              type="text"
              value={cardData.number}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19));
                handleInputChange('number', formatted);
              }}
              placeholder="1234 5678 9012 3456"
              disabled={loading}
              className={inputClass(!!errors.number)}
            />
            {errors.number && <p className="mt-1 text-red-600 ">{errors.number}</p>}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block font-medium text-black mb-1">
                Expiry Date (MM/YY)
              </label>
              <input
                id="expiry"
                type="text"
                value={cardData.expiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  handleInputChange('expiry', formatted);
                }}
                placeholder="12/29"
                maxLength={5}
                disabled={loading}
                className={inputClass(!!errors.expiry)}
              />
              {errors.expiry && <p className="mt-1 text-red-600 ">{errors.expiry}</p>}
            </div>

            <div>
              <label htmlFor="cvv" className="block font-medium text-black mb-1">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                value={cardData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                disabled={loading}
                className={inputClass(!!errors.cvv)}
              />
              {errors.cvv && <p className="mt-1 text-red-600 ">{errors.cvv}</p>}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label htmlFor="name" className="block font-medium text-black mb-1">
              Cardholder Name
            </label>
            <input
              id="name"
              type="text"
              value={cardData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              disabled={loading}
              className={inputClass(!!errors.name)}
            />
            {errors.name && <p className="mt-1 text-red-600 ">{errors.name}</p>}
          </div>

          {/* Billing Address */}
          <div>
            <label htmlFor="address" className="block font-medium text-black mb-1">
              Billing Address
            </label>
            <input
              id="address"
              type="text"
              value={cardData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Main St"
              disabled={loading}
              className={inputClass(!!errors.address)}
            />
            {errors.address && <p className="mt-1 text-red-600 ">{errors.address}</p>}
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block font-medium text-black mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                value={cardData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="San Jose"
                disabled={loading}
                className={inputClass(!!errors.city)}
              />
              {errors.city && <p className="mt-1 text-red-600 ">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block font-medium text-black mb-1">
                State
              </label>
              <input
                id="state"
                type="text"
                value={cardData.state}
                onChange={(e) => handleInputChange('state', e.target.value.toUpperCase().slice(0, 2))}
                placeholder="CA"
                maxLength={2}
                disabled={loading}
                className={inputClass(!!errors.state)}
              />
              {errors.state && <p className="mt-1 text-red-600 ">{errors.state}</p>}
            </div>

            <div>
              <label htmlFor="zipCode" className="block font-medium text-black mb-1">
                ZIP Code
              </label>
              <input
                id="zipCode"
                type="text"
                value={cardData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value.slice(0, 10))}
                placeholder="95131"
                disabled={loading}
                className={inputClass(!!errors.zipCode)}
              />
              {errors.zipCode && <p className="mt-1 text-red-600 ">{errors.zipCode}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 text-white px-6 py-3 rounded-full font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-purple hover:bg-purple-700'
            }`}
          >
            {loading ? 'Adding Card...' : 'Add Card'}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-full font-medium transition-colors ${
              loading 
                ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                : 'border-2 border-primary-purple text-primary-purple hover:bg-purple-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export type { CardData };
