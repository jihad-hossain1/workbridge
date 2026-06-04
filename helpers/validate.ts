import { z } from "zod";

export type TUserRegister = {
  email: string;
  password: string;
  mobile: string;
  firstName: string;
  lastName: string;
};

export type TCustomer = {
  id?: number;
  isActive?: boolean;
  name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  address?: string;
  businessId?: number;
  cusCode?: string;
  createdAt?: string | Date;
};

export type TBusiness = {
  id?: number | string;
  email: string;
  mobile?: string;
  isActive?: boolean | string;
  createdAt?: string | Date;
};
