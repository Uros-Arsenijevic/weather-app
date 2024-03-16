export function createListItem(countryCode, allCountry) {
  countryCode = countryCode.split("-");
  const [currentCountryCode] = countryCode;
  if (
    countryCode.length === 2 ||
    currentCountryCode === "eu" ||
    currentCountryCode === "un"
  ) {
    return;
  }
  
  let countryFlagUrl = `https://countryflagsapi.netlify.app/flag/${currentCountryCode}.svg`;

  return `
      <li>
        ${allCountry[currentCountryCode]}
        <img
          class="country-flag"
          src=${countryFlagUrl}
        >
      </li>
    `;
}
