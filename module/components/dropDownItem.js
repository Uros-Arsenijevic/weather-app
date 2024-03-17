export function createListItem(allCountry) {
  // TODO: preimenovati imena variabli na jasnija
  const entries = Object.entries(allCountry);

  let sortCountries = entries.sort((a, b) => {
    const aChars = a[1].split("");
    const bChars = b[1].split("");

    const minLength = Math.min(aChars.length, bChars.length);

    for (let i = 0; i < minLength; i++) {
      if (aChars[i].charCodeAt() !== bChars[i].charCodeAt()) {
        return aChars[i].charCodeAt() - bChars[i].charCodeAt();
      }
    }

    return aChars.length - bChars.length;
  });
  const listItem = [];

  for (let [countryCode, countryName] of sortCountries) {
    countryCode = countryCode.split("-");
    const [currentCountryCode] = countryCode;
    if (
      countryCode.length === 2 ||
      currentCountryCode === "eu" ||
      currentCountryCode === "un"
    ) {
      continue;
    }
    let countryFlagUrl = `https://countryflagsapi.netlify.app/flag/${currentCountryCode}.svg`;

    listItem.push(`
        <li>
          ${countryName}
          <img
            class="country-flag"
            src=${countryFlagUrl}
          >
        </li>
      `);
  }

  return listItem;

}
