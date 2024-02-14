export type LoginRefreshServiceInputDto = {
  refreshToken: string;
};

export type LoginRefreshServiceOutputDto = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};
