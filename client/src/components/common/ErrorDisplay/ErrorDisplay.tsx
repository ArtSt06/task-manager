import "./ErrorDisplay.scss";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

const ErrorDisplay = ({
  title,
  message,
  onRetry,
  fullPage = false,
}: ErrorDisplayProps) => {
  return (
    <div className={`error-display ${fullPage ? "full-page" : ""}`}>
      <div className="error-content">
        {title && <h2 className="error-title">{title}</h2>}

        <p className="error-message">{message || "Неизвестная ошибка"}</p>

        {onRetry && (
          <button className="error-retry" onClick={onRetry}>
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
