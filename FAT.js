// ==UserScript==
// @name        FAT
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
    let modifiedStrElement = strElement.replace(/\.shadowRoot/g, "?.shadowRoot");
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
      color = color.toLowerCase() in definedColor ? definedColor[color.toLowerCase()] : color.toLowerCase();
      console.info(`%c${content}`, `color: ${color}`);
    } else {
      console.info(content);
    }
  },

  /**
   * Open a new window to show the log or result.
   * @param {string} title - title of the window and report
   * @param {string} content - what report shows
   */
  async report(title, content) {
    // open new window
    let newWindow = window.open("", "_blank", "width=600,height=750");
    let reportContent = "";
    if (newWindow) {
      content.forEach((obj) => {
        const keys = Object.keys(obj);
        if (typeof obj !== "object") {
          console.error("The member of the content should be key-value type.");
          return false;
        }
        switch (keys[0].toLocaleLowerCase()) {
          case "pass":
            reportContent = reportContent + fat.template.pass(obj.pass);
            break;
          case "fail":
            reportContent = reportContent + fat.template.fail(obj.fail);
            break;
          default:
            reportContent = reportContent + fat.template.default(obj[keys[0]]);
            break;
        }
      });

      // Insert HTML content
      newWindow.document.write(fat.template.report(title, reportContent));
      // refresh new window
      newWindow.document.close();
      return true;
    } else {
      console.error("Failed to open a new window. Please check your browser's popup settings.");
      return false;
    }
  },

  /**
   * Load the all log in one valuable
   * @param {Array} contentList - the collector of the log
   * @param {object} content - Format: {type: 'xxxxxxx'}
   *                                    type in [pass, fail, default]
   * @returns {boolean} - The flag of method
   */
  async load(contentList, content) {
    await contentList.push(content);
    return true;
  },

  /**
   * The progress pause in the configed time
   * @param {string} element - JS path of element in the browser
   * @param {number} [maxAttempts=60] - Maximum number of attempts (default is 100)
   * @param {number} [interval=500] - Detection interval (milliseconds, default is 500)
   * @returns {boolean} - The flag of method
   */
  async exist(element, maxAttempts = 60, interval = 500) {
    let attempts = 0;

    // Create a helper function that returns a Promise
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (attempts < maxAttempts) {
      let targetElement = util.element(element);

      if (targetElement) {
        return targetElement;
      } else {
        attempts++;
        await wait(interval);
      }
    }
    return false;
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

  /**
   * The progress pause in the configed time
   * @param {number} [time] - the stop time you hope
   * @param {string} strElement - unit of the time. The default unit is ms
   * @returns {boolean} - The flag of method
   */
  async stop(time, unit = "ms") {
    if (typeof time !== "number") {
      console.error("The time should be number type only.");
      return false;
    }

    switch (unit) {
      case "s":
        unit = 1000;
        break;
      case "m":
        unit = 1000 * 60;
        break;
      case "h":
        unit = 1000 * 60 * 60;
        break;
      default:
        unit = 1;
    }
    fat.log("Step waiting " + (time * unit) / 1000 + " s...");
    await new Promise((resolve) => setTimeout(resolve, time * unit));
    return true;
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

  /**
   * Tasks in work flow can launch in order and get the previous status
   * @param {Array[Function]} actionList - the list of function
   * @returns {boolean} - The flag of method
   */
  async flow(actionList) {
    let status = "init";
    for (let func of actionList) {
      const result = await func(status);
      status = true;
      if (result !== true) {
        status = false;
      }
    }
    return true;
  },

  template: {
    report(title, content) {
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #fdf5e6;
                  margin: 20px;
              }
              h1 {
                  color: #333;
              }
              .pass {
                 color: green;
               }
              .fail {
                 color: red;
               }
          </style>
      </head>
    
      <body>
          <h1>${title}</h1>      
         ${content}
      </body>
      </html>
    `;
    },
    pass(content) {
      return `<h4 class="pass">✓ ${content}</h4>`;
    },
    fail(content) {
      return `<h4 class="fail">✗ ${content}</h4>`;
    },
    default(content) {
      return `<h4>${content}</h4>`;
    },
  },
};
