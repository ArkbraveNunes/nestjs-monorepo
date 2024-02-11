export type LoginServiceInputDto = {
  email: string;
  password: string;
};

export type LoginServiceOutputDto = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};
