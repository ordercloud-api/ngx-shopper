export interface CountryDefinition {
  label: string;
  abbreviation: string;
}

export interface StateDefinition {
  label: string;
  abbreviation: string;
  country: string;
}
