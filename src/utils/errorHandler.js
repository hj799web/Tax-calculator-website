export function handleError(error, showUserMessage) {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }
  if (typeof showUserMessage === 'function') {
    showUserMessage("Something went wrong. Please try again later.");
  }
} 