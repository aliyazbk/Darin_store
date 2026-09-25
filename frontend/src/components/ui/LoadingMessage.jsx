import "../../styles/components/FeedbackMessage.css";

function LoadingMessage({
  message = "Loading...",
}) {
  return (
    <p
      className="ui-message ui-message--loading"
      role="status"
    >
      {message}
    </p>
  );
}

export default LoadingMessage;