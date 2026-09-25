import "../../styles/components/FeedbackMessage.css";

function ErrorMessage({ message }) {
  return (
    <p
      className="ui-message ui-message--error"
      role="alert"
    >
      {message}
    </p>
  );
}

export default ErrorMessage;