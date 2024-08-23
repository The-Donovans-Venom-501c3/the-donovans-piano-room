import { TermsOfUseContent } from './TermsOfUseContent';
import { PrivacyPolicyContent } from './PrivacyPolicyContent';
import CloseIcon from '@mui/icons-material/Close';

const TermsandCondition = ({ isOpen, onClose, content }: { isOpen: boolean; onClose: () => void; content: 'terms' | 'privacy' }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-[30vw] w-full relative overflow-y-auto max-h-[70vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500">
          <CloseIcon />
        </button>
        <div className="text-black">
          <div className="text-base md:text-lg">
            {getContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsandCondition;
