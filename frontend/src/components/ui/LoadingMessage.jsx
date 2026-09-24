function LoadingMessage({ message = "Loading..." }) {
  return <p role="status">{message}</p>;
}

export default LoadingMessage;