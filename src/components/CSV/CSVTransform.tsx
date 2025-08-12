import { TransformType } from "./CSV";

export const transformCSV = (value:string, type:TransformType) => {
  switch (type) {
    case 'text':
      return value;
    case 'gender':
      return t_gender(value);
    case 'date':
      return t_date(value);
    case 'phone':
      return t_phone(value);
    case 'email':
      return t_email(value);
    case 'street':
      return t_street(value);
    case 'number':
      return t_number(value);
    default:
      return value;
  }
};

const t_number = (value: string): number | undefined => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
};

const t_gender = (value: string):number | undefined => {
  const maleGenders = ['male', 'man', 'homme', 'herr', 'monsieur', 'masculin', 'm', 'mr', 'männlich','uomo', 'signor', 'maschio'];
  const femaleGenders = ['female', 'woman', 'femme', 'frau', 'madame', 'féminin', 'w', 'ms', 'weiblich','donna', 'signora', 'femminile'];
  const normalizedValue = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  var maleMatch = normalizedValue.match(new RegExp("\\b(" + maleGenders.join('|') + ")\\b", "ig"));
  var femaleMatch = normalizedValue.match(new RegExp("\\b(" + femaleGenders.join('|') + ")\\b", "ig"));

  if (maleMatch) {
    return 1;
  } else if (femaleMatch) {
    return 2;
  }
  else{
    return undefined;
  }
};

const t_date = (value: string): string | undefined => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date.toISOString();
};

const t_phone = (value: string): string | undefined => {
    const swissPhoneRegex = /(?:00[0-9]{2}|\+[1-9]{2})*\s?([1-9]{2,3})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})\b/;

    const swissMatch = value.match(swissPhoneRegex);
    if (swissMatch) {
        return `+41 0${swissMatch[1]} ${swissMatch[2]} ${swissMatch[3]} ${swissMatch[4]}`;
    }
    else{
        return undefined;
    }
};

const t_email = (value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? value.toLowerCase() : undefined;
};

const t_street = (value: string): { street: string, number: string } | undefined => {
    const streetRegex = /^(.*?)(\d+\s*[A-z]*)$/;
    const match = value.trim().match(streetRegex);
    if (match) {
        return { street: match[1].trim(), number: match[2].trim() };
    }
    return undefined;
};