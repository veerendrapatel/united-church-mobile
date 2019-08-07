import * as Google from "expo-google-app-auth";

export const googleLogin = async (config: Google.GoogleLogInConfig) => {
  const result = await Google.logInAsync(config);
  return result.type === "success" ? result.accessToken : undefined;
};

export const googleLogout = async (
  config: Google.GoogleLogInConfig,
  accessToken: string
) => await Google.logOutAsync({ ...config, accessToken });
