export interface CustomFieldOption {
  label: string;
  value: string;
  id: string;
}

export type CustomFieldType = "multi-dropdown" | "date";

export interface CustomField {
  id: string;
  type: CustomFieldType;
  name: string;
  options?: CustomFieldOption[];
}
