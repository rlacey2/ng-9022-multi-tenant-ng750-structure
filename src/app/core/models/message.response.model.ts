export interface MessageResponseT55 {
  message?: string;
  tag?: string;
  cId?: string | number;
  [key: string]: unknown; // Allows additional unknown properties from the API without TS errors
}