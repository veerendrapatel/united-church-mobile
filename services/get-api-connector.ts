import {
  createFeathersAuthProvider,
  createFeathersClient,
  createFeathersDataProvider
} from "ra-feathersjs-oauth";
import { IFeathersClient } from "ra-feathersjs-oauth/lib/types/feathers-client";

const actions = {
  AUTH_LOGIN: "AUTH_LOGIN",
  AUTH_ERROR: "AUTH_ERROR",
  AUTH_CHECK: "AUTH_CHECK",
  AUTH_GET_PERMISSIONS: "AUTH_GET_PERMISSION",
  AUTH_LOGOUT: "AUTH_LOGOUT",
  CREATE: "CREATE",
  CREATE_MANY: "CREATE_MANY",
  GET_ONE: "GET_ONE",
  GET_LIST: "GET_LIST",
  GET_MANY: "GET_MANY",
  GET_MANY_REFERENCE: "GET_MANY_REFERENCE",
  UPDATE: "UPDATE",
  UPDATE_MANY: "UPDATE_MANY",
  DELETE: "DELETE",
  DELETE_MANY: "DELETE_MANY"
};

export const makeClient = (apiUrl: string) =>
  createFeathersClient(apiUrl, {
    storage: localStorage,
    locationKey: `united-church-token${apiUrl}`
  });

export const makeAuthProvider = (
  apiUrl: string,
  apiClient?: IFeathersClient
) => {
  const client = apiClient || makeClient(apiUrl);
  return createFeathersAuthProvider(client, {
    ...actions,
    permissionsField: "permissions",
    oauthStrategy: "google"
  });
};

export const makeDataProvider = (
  apiUrl: string,
  apiClient?: IFeathersClient,
  config?: {
    resourcePrimaryKeyFieldMap?: { [key: string]: string };
    resourceUploadableFieldMap?: { [key: string]: string };
    resourceUploadsForeignKeyMap?: { [key: string]: string };
  }
) => {
  const client = apiClient || makeClient(apiUrl);
  return createFeathersDataProvider(client, {
    ...actions,
    ...config,
    uploadsUrl: `${apiUrl}/uploads`,
    multerFieldNameSetting: "files",
    defaultPrimaryKeyField: "_id"
  });
};

export default (
  apiUrl: string,
  config?: {
    resourcePrimaryKeyFieldMap?: { [key: string]: string };
    resourceUploadableFieldMap?: { [key: string]: string };
    resourceUploadsForeignKeyMap?: { [key: string]: string };
  }
) => {
  const client = makeClient(apiUrl);
  return {
    actions,
    client,
    authProvider: makeAuthProvider(apiUrl, client),
    dataProvider: makeDataProvider(apiUrl, client, config)
  };
};
