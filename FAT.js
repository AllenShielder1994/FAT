// ==UserScript==
// @name        Start Trace
// @namespace   Violentmonkey Scripts
// @match       http://10.210.154.25:8080/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/16/2024, 1:07:21 PM
// ==/UserScript==

const util = {
  /**
   * Get nested elements by dynamically generating code
   * This is one of the basement function also
   * @param {string} strElement - Selector chain string
   * @returns {Element|null} - the element found or null
   */
  element(strElement) {
    // Replace .shadowRoot in strings to handle multiple nested levels
    const popableErrType = ["SyntaxError"];
    let modifiedStrElement = strElement.replace(
      /\.shadowRoot/g,
      "?.shadowRoot"
    );
    let objElement;
    try {
      // Use eval to execute the modified string
      objElement = eval(modifiedStrElement);
    } catch (err) {
      const errString = String(err);
      const errType = errString.split(":")[0];
      if (popableErrType.includes(errType)) console.error(err);
    }
    return objElement;
  },
};

const fat = {
  /**
   * @param {string} content - log content
   * @param {string} color - the color of the text in content
   */
  log(content, color = null) {
    const definedColor = {
      red: "rgb(224, 108, 117)",
      green: "rgb(152, 195, 121)",
      blue: "rgb(97, 175, 239)",
    };

    if (typeof color === "string") {
      color =
        color.toLowerCase() in definedColor
          ? definedColor[color.toLowerCase()]
          : color.toLowerCase();
      console.info(`%c${content}`, `color: ${color}`);
    } else {
      console.info(content);
    }
  },

  /**
   * Starts polling to check if the target element exists and
   * performs a click action if found
   * @param {Function} element - Function used to get the target element
   * @param {string} strElement - Selector chain string
   * @param {number} [maxAttempts=100] - Maximum number of attempts (default is 100)
   * @param {number} [interval=500] - Detection interval (milliseconds, default is 500)
   * @returns {boolean} - The flag of method
   */

  async click(strElement, maxAttempts = 100, interval = 500) {
    let attempts = 0;

    // Create a helper function that returns a Promise
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (attempts < maxAttempts) {
      let targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Elements were reached and ready to click", "green");
        targetElement.click();
        const event = new Event("change", { bubbles: true });
        targetElement.dispatchEvent(event);
        return true; // Exit the function after successfully finding the element
      } else {
        attempts++;
        fat.log(`Attempting to reach elements: ${attempts}/${maxAttempts}`);
        await wait(interval); // Wait for the specified time before continuing to poll
      }
    }

    fat.log("Maximum number of attempts exceeded", "red");
    return false;
  },

  /**
   * Starts polling to check if the target element exists
   * and performs input operations if found
   * @param {Function} element - Function used to get the target element
   * @param {string} strElement - Selector chain string
   * @param {number} [textContent] - Input content
   * @param {number} [maxAttempts=100] - Maximum number of attempts (default is 100)
   * @param {number} [interval=500] - Detection interval (milliseconds, default is 500)
   * @returns {boolean} - The flag of method
   */
  async input(strElement, textContent, maxAttempts = 100, interval = 500) {
    let attempts = 0;

    // Create a helper function that returns a Promise
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (attempts < maxAttempts) {
      let targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Elements were reached and ready to click", "green");
        targetElement.value = textContent;
        targetElement.dispatchEvent(new Event("input", { bubbles: true }));
        targetElement.dispatchEvent(new Event("change", { bubbles: true }));

        return true; // Exit the function after successfully finding the element
      } else {
        attempts++;
        fat.log(`Attempting to reach elements: ${attempts}/${maxAttempts}`);
        await wait(interval); // Wait for the specified time before continuing to poll
      }
    }

    fat.log("Maximum number of attempts exceeded", "red");
    return false;
  },
  // TODO: The select method will be completed in the future.
  // Currently, the select items in the project are all div plus lists, so this method is not used yet.
  async select(strElement, maxAttempts = 100, interval = 500) {
    let attempts = 0;

    // Create a helper function that returns a Promise
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (attempts < maxAttempts) {
      let targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Elements were reached and ready to click", "green");
        // targetElement.click();
        const options = targetElement.options;
        console.log("这个内容是", options);

        return true;
      } else {
        attempts++;
        fat.log(`Attempting to reach elements: ${attempts}/${maxAttempts}`);
        await wait(interval);
      }
    }

    fat.log("Maximum number of attempts exceeded", "red");
    return false;
  },

  /**
   * Used to build more complex front-end actions
   * @param {Array[Function]} actionList - the list of function
   * @returns {boolean} - The flag of method
   */
  async action(actionList) {
    for (let func of actionList) {
      const result = await func();
      if (result !== true) {
        console.error("Function did not return true:", func.name);
        return false;
      }
    }
    return true;
  },
};
