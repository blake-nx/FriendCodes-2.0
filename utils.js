// Format friend code before saving to database
const formatFriendCode = (code) => {
  // Remove dashes and spaces from the code
  const cleanedCode = code.replace(/[-\s]/g, "");

  // Split the cleaned string into groups of 4 characters each
  const groups = cleanedCode.match(/.{1,4}/g);

  // Join the groups with spaces and return the formatted string e.g. 1234 5678 9012.
  return groups.join(" ");
};

module.exports = { formatFriendCode };
