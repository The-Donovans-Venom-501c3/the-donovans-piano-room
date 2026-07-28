import { TermsOfUseContent } from './TermsOfUseContent';
import { PrivacyPolicyContent } from './PrivacyPolicyContent';
import CloseIcon from '@mui/icons-material/Close';
<<<<<<< HEAD
=======
// @ts-ignore
import '@/styles/primary-purple-scrollbar.css'
>>>>>>> b2179fb (feat: add mobile warning popup and update signup, account, and layout UI components)

interface TermsandConditionProps {
  isOpen: boolean;
  onClose: () => void;
  content: 'terms' | 'privacy';
}

const TermsandCondition = ({ isOpen, onClose, content }: TermsandConditionProps) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (content) {
      case 'terms':
        return <TermsOfUseContent />;
      case 'privacy':
        return <PrivacyPolicyContent />;
      default:
        return null;
    }
  };

  return (
    /* Backdrop with click-to-close */
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl rounded-lg bg-white p-6 shadow-2xl"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          aria-label="Close modal"
          className="absolute top-4 right-4 text-primary-purple hover:opacity-80 transition-opacity"
        >
          <CloseIcon className="text-3xl font-bold 3xl:text-3xl 4xl:text-4xl" />
        </button>

        {/* Modal Content */}
        <div className="mt-6 max-h-[70vh] overflow-y-auto text-black">
          <div className="text-base md:text-lg">
            {getContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsandCondition;