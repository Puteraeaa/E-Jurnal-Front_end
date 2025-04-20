import badWordsData from "./badwords.json";

const badWords = badWordsData.badwords || []; // Pastikan ini array

export const filterBadWords = async (text) => {
  let hasBadWords = false;

  // Replace kata-kata yang dilarang dengan sensor
  const filteredText = text
    .split(" ")
    .map((word) => {
      if (badWords.includes(word.toLowerCase())) {
        hasBadWords = true;
        return "*".repeat(word.length); // Sensor kata
      }
      return word;
    })
    .join(" ");

  return { filteredText, hasBadWords };
};
