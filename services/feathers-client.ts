import { googleLogin, googleLogout } from "./google-auth";

const _remoteLoginThenAuthenticate = async (
  remoteLogin: () => Promise<string>,
  saveToken: (token: string) => Promise<any>,
  apiUrl: string,
  defaultRequestConfig: RequestInit
) => {
  const token = await remoteLogin();
  await saveToken(token);

  const customConfig = {
    ...defaultRequestConfig,
    headers: { ...(defaultRequestConfig.headers || {}), Authorization: token }
  };
  const newResponse = await fetch(`${apiUrl}/authentication`, customConfig);
  return await newResponse.json();
};

const _updateConfig = async (
  defaultRequestConfig: RequestInit,
  retrieveToken: () => Promise<string>,
  method: string
) => {
  const accessToken = await retrieveToken();
  const customConfig = {
    ...defaultRequestConfig,
    headers: {
      ...defaultRequestConfig.headers,
      Authorization: accessToken
    },
    method
  };
  return { accessToken, customConfig };
};

export const createFeathersRestClient = ({
  apiUrl,
  saveToken,
  deleteToken,
  retrieveToken,
  remoteLogin,
  remoteLogout
}: {
  apiUrl: string;
  saveToken: (token: string) => Promise<any>;
  deleteToken: () => Promise<any>;
  retrieveToken: () => Promise<string>;
  remoteLogin: () => Promise<string>;
  remoteLogout: (accessToken: string) => Promise<any>;
}) => {
  const config: RequestInit = {
    headers: { "Content-Type": "application/json" },
    mode: "cors"
  };

  return service => {
    if (service === "auth") {
      return {
        authenticate: async () => {
          const { accessToken, customConfig } = await _updateConfig(
            config,
            retrieveToken,
            "POST"
          );

          if (accessToken) {
            try {
              const response = await fetch(
                `${apiUrl}/authentication`,
                customConfig
              );
              return await response.json();
            } catch (error) {
              if (error.className === "not-authenticated") {
                return await _remoteLoginThenAuthenticate(
                  remoteLogin,
                  saveToken,
                  apiUrl,
                  customConfig
                );
              } else {
                throw error;
              }
            }
          } else {
            return await _remoteLoginThenAuthenticate(
              remoteLogin,
              saveToken,
              apiUrl,
              customConfig
            );
          }
        },
        logout: async () => {
          const accessToken = await retrieveToken();
          await remoteLogout(accessToken);
          await deleteToken();
        }
      };
    }

    return {
      create: async () => {},
      update: () => {},
      remove: () => {},
      patch: () => {},
      find: async () => {
        const { accessToken, customConfig } = await _updateConfig(
          config,
          retrieveToken,
          "GET"
        );
        const response = await fetch(`${apiUrl}/${service}`, customConfig);
      },
      get: async () => {}

      // uploadFile: () => {}
    };
  };
};
