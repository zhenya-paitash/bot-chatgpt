import config, { IConfig } from 'config'
import { IConfigService, TConfigKey } from "./config.interface.js";

class ConfigService implements IConfigService {
  private config: IConfig

  /**
   * This is a constructor function that initializes an object with a given
   * configuration.
   */
  constructor() {
    this.config = config
  }

  /**
   * This function retrieves a value from a configuration object based on a given
   * key and throws an error if the key is not found.
   * @param {TConfigKey} key - TConfigKey, which is a type alias for a string
   * literal type representing the keys of the configuration object.
   * @returns The `get()` method is returning a string value associated with the
   * provided `key` parameter in the `config` object. If the `key` is not found in
   * the `config` object, it throws an error with a message indicating that the key
   * was not found.
   */
  get(key: TConfigKey): string {
    const isExist: boolean =  this.config.has(key)
    if (!isExist) {
      const error = `Config: key "${key}" not found.`
      throw new Error(error)
    }

    return this.config.get(key)
  }

  /**
   * The function checks if a given key exists in a configuration object and
   * returns a boolean value.
   * @param {TConfigKey} key - TConfigKey is a type parameter that represents the
   * key used to access a value in a configuration object. It could be a string,
   * number, or any other data type that can be used as a key. The `has` method
   * checks if the configuration object has a value associated with the given key
   * @returns A boolean value indicating whether the given key exists in the
   * configuration or not.
   */
  has(key: TConfigKey): boolean {
    return this.config.has(key)
  }
}

/* `export const configService = new ConfigService()` is exporting an instance of
the `ConfigService` class as a named export called `configService`. This allows
other modules to import and use the `configService` instance to access
configuration values. */
export const configService = new ConfigService()