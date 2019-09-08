import * as Google from "expo-google-app-auth";

export const googleLogin = async (config: Google.GoogleLogInConfig) => {
  const result = await Google.logInAsync(config);
  if (result.type === "success") {
    return result.accessToken;
  }
  throw new Error("Logging in was cancelled.");
};

export const googleLogout = async (
  config: Google.GoogleLogInConfig,
  accessToken: string
) => await Google.logOutAsync({ ...config, accessToken });
