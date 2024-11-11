import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faCheckCircle, faExclamationCircle, faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import Link from "next/link";

const ICONS = {
  info: faInfoCircle,
  warning: faExclamationTriangle,
  error: faExclamationCircle,
  success: faCheckCircle,
};

const COLORS = {
  info: "bg-blue-100 text-blue-800 border-blue-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  error: "bg-red-100 text-red-800 border-red-300",
  success: "bg-green-100 text-green-800 border-green-300",
};

interface BannerProps {
  type?: "info" | "warning" | "error" | "success";
  message: string;
  actionText?: string;
  actionLink?: string;
  onClose?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ type = "info", message, actionText, actionLink, onClose }) => {
  return (
    <div className={`flex items-center border-l-4 p-4 mb-4 ${COLORS[type]}`}>
      <FontAwesomeIcon icon={ICONS[type]} className="mr-3 w-5 h-5" size="lg" />
      <div className="flex-1">{message}</div>
      {actionLink && (
        <Link href={actionLink} className="ml-4 text-sm font-medium underline">
          {actionText}
        </Link>
      )}
      {onClose && (
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-800">
          ✕
        </button>
      )}
    </div>
  );
};