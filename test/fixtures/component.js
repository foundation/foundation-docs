/**
 * This is a module.
 * @module foundation.module
 * @requires foundation.core
 */

class Plugin {
  /**
   * This is a class constructor.
   * @fires init.zf.plugin
   * @param {object} param1 - This is a parameter.
   * @param {string=} param2 - This is an optional parameter.
   * @param {boolean} [param3=true] - This is an optional parameter with a default value.
   * @param {string|null} param4 - This is a parameter that accepts multiple types.
   */
  constructor(param1) {
    /**
     * Fires if the target element has the class after a toggle.
     * @event init.zf.plugin
     */
    $(document).trigger('init.zf.plugin');
  }

  /**
   * This is a function with a callback parameter.
   * @param {callbackFunctionCallback} cb - Callback to run.
   */
  callbackFunction(cb) {
    /**
     * Runs when the asynchronous function is done.
     * @callback callbackFunctionCallback
     * @param {string} thing - A parameter.
     */
    cb(thing);
  }

  /**
   * This is a private function.
   * @private
   */
  _privateFunction() {}

  /**
   * This function was added in a specific version.
   * @since 6.1.0
   */
  sinceFunction() {}

  /**
   * This is a function with examples.
   *
   * @example
   * Plugin.exampleFunction(false); // => true
   *
   * @example <caption>This example has a caption.</caption>
   * Plugin.exampleFunction(true); // => false
   *
   * @returns {boolean} The reverse!
   */
  exampleFunction(bool) {
    return !bool;
  }
}
