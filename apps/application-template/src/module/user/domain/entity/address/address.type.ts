export type AddressProps = {
  id: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode: string;
  coordinates?: {
    latitude: string;
    longitude: string;
  };
  createdAt: string;
  updatedAt: string;
};
