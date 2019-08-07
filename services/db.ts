import { AsyncStorage } from "react-native";

type callbackType = (error?: any, result?: any) => any;

export default class Store {
  public cachePeriod: number;
  private _prefix: string;

  constructor(cachePeriodMilliseconds = 60000, prefix = "") {
    this.cachePeriod = cachePeriodMilliseconds;
    this._prefix = prefix;
  }

  _processKey = key => `${this._prefix}${key}`;

  _isStale = (item: any) => {
    const elapsedPeriod = new Date().getTime() - item.createdAt;
    return elapsedPeriod >= this.cachePeriod;
  };

  saveItem = async (key: string, item: any, callback: callbackType) => {
    let data = { payload: item, createdAt: new Date().getTime() };
    const processedKey = this._processKey(key);

    try {
      // the data is saved as a string just like in localstorage
      await AsyncStorage.setItem(processedKey, JSON.stringify(data));
      callback(undefined, item);
    } catch (e) {
      callback(e);
    }
  };

  deleteItem = async (key: string, callback: callbackType) => {
    const processedKey = this._processKey(key);

    try {
      await AsyncStorage.removeItem(processedKey);
      callback(undefined, true);
    } catch (error) {
      callback(error);
    }
  };

  getItem = async (key: string, callback: callbackType) => {
    const processedKey = this._processKey(key);

    try {
      const value = await AsyncStorage.getItem(processedKey);
      if (value !== null) {
        // retrieve the string and convert it back to its original
        const valueObj = JSON.parse(value);
        if (this._isStale(valueObj)) {
          this.deleteItem(key, err => {
            if (!err) {
              callback(new Error("Item no longer exists."));
            } else {
              callback(new Error("Error updating the cache in the store"));
            }
          });
        } else {
          callback(undefined, valueObj.payload);
        }
      } else {
        callback(new Error("Item does not exist"));
      }
    } catch (error) {
      callback(error);
    }
  };
}
