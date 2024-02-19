const capitalizeFirstLetter = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const normalizeString = (inputString) => {
  const lowerCaseString = inputString.toLowerCase();

  // Remove any symbols using regular expression
  const normalizedString = lowerCaseString.replace(/[^\w\s]/g, "");

  return normalizedString;
}

export { capitalizeFirstLetter, normalizeString };
