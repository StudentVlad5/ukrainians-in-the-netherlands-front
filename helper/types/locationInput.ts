interface LocationValue {
  address?: string;
  lat?: number;
  lng?: number;
}

export interface LocationInputProps {
  value?: LocationValue;
  onChange: (value: LocationValue) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}
