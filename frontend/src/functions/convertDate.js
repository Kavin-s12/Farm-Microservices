export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Convert date to desired format
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleString("en-US", options);
};
