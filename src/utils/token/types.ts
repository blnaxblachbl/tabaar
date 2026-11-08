export type Verify = {
  id: number;
  email: string;
  expired?: boolean;
};
export type AllTokens = {
  accessToken: string;
  refreshToken: string;
};
