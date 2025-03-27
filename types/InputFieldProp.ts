export type InputFieldProp = {
  labelText: string;
  name: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};
