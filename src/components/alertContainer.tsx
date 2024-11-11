import { useAlert } from "@/context/AlertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faInfoCircle, faCheckCircle, faExclamationCircle, faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";

type AlertType = "info" | "success" | "warning" | "error";

const alertStyles: Record<AlertType, { bg: string; text: string; icon: IconDefinition }> = {
  info: { bg: "bg-blue-50", text: "text-blue-700", icon: faInfoCircle },
  success: { bg: "bg-green-50", text: "text-green-700", icon: faCheckCircle },
  warning: { bg: "bg-yellow-50", text: "text-yellow-700", icon: faExclamationCircle },
  error: { bg: "bg-red-50", text: "text-red-700", icon: faExclamationTriangle },
};

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="fixed top-5 right-5 z-50 space-y-4">
      {alerts.map((alert) => {
        const { bg, text, icon } = alertStyles[alert.type as AlertType] || alertStyles.info;
        return (
          <div key={alert.id} className={`rounded-md ${bg} p-4 shadow-lg`}>
            <div className="flex">
              <FontAwesomeIcon icon={icon} className={`h-5 w-5 ${text}`} />
              <div className="ml-3">
                <p className={`text-sm ${text}`}>{alert.message}</p>
              </div>
              <button onClick={() => removeAlert(alert.id)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-gray-500 hover:text-gray-700">
                <span className="sr-only">Dismiss</span>✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}