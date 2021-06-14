import { xmlToJson } from "./xml2json";

export const show = (node) => node.classList.remove("hidden")
export const hide = (node) => node.classList.add("hidden")

export const getJSON = (text) => {
  const xmlNode = new DOMParser().parseFromString(text, "text/xml");
  const json = xmlToJson(xmlNode);

  return json;
};

export const parsePPK = (json) => {
  const people = json.PPK.DANE_UCZESTNIKA.UCZESTNIK.map((person) => {
    const result = Object.assign({}, person);

    if (!result.DOK_TOZ_TYP) {
      result.DOK_TOZ_SYM = undefined;
    }

    if (result.DOK_TOZ_TYP === "D") {
      result.DOK_TOZ_TYP = null;
      result.DOK_TOZ_SYM = undefined;
    }

    if (result.DOK_TOZ_TYP === "P") {
      result.DOK_TOZ_SYM = result.DOK_TOZ_SYM.replace(/ /g, "");
    }

    if (result.REJESTRACJA) {
      if (result.REJESTRACJA.KONTAKT_TEL) {
        result.REJESTRACJA.KONTAKT_TEL = result.REJESTRACJA.KONTAKT_TEL.replace(
          /[ \-]/g,
          ""
        );
      }

      if (!result.REJESTRACJA.ADR_ZAM_KRAJ) {
        result.REJESTRACJA.ADR_ZAM_KRAJ = "PL";
      }

      if (result.REJESTRACJA.ADR_KOR_ULICA || result.REJESTRACJA.ADR_KOR_MSC) {
        result.REJESTRACJA.ADR_KOR_KRAJ = result.REJESTRACJA.ADR_KOR_KRAJ || "PL";
      }
    }

    return result;
  });

  return {
    PPK: {
      ...json.PPK,
      DANE_UCZESTNIKA: {
        UCZESTNIK: people,
      },
    },
  };
};

export const getPeopleNames = (json) => {
  return json.PPK.DANE_UCZESTNIKA.UCZESTNIK.map((person) => {
    return `${person.IMIE} ${person.NAZWISKO}`;
  });
};

export const downloadText = (text, filename) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}