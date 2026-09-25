import "../../styles/components/FeedbackMessage.css";

function EmptyMessage({
  message = "Nothing was found.",
}) {
  return (
    <p className="ui-message ui-message--empty">
      {message}
    </p>
  );
}

export default EmptyMessage;