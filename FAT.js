// ==UserScript==
// @name        FAT
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      Allen Shielder
// @description 8/16/2024, 1:07:21 PM
// ==/UserScript==

const util = {
  /**
   * Retrieve nested elements by dynamically generating code.
   * This is a foundational function.
   * @param {string} strElement - Selector chain string for the element.
   * @returns {Element|null} - The found element or null if not found.
   */
  element(strElement) {
    const allowedErrors = ["SyntaxError"];
    // Modify the selector chain to support shadow DOM traversal.
    let modifiedStrElement = strElement.replace(/\.shadowRoot/g, "?.shadowRoot");
    let objElement;

    try {
      // Use eval to evaluate the modified selector chain.
      objElement = eval(modifiedStrElement);
    } catch (err) {
      if (allowedErrors.includes(err.name)) {
        console.error(err);
      }
    }
    return objElement;
  },
};

const fat = {
  /**
   * Log messages with optional colored output.
   * @param {string} content - The message to log.
   * @param {string|null} color - The color for the text, or null for default.
   */
  log(content, color = null) {
    const definedColors = {
      red: "rgb(224, 108, 117)",
      green: "rgb(152, 195, 121)",
      blue: "rgb(97, 175, 239)",
    };

    if (color && typeof color === "string") {
      color = definedColors[color.toLowerCase()] || color.toLowerCase();
      console.info(`%c${content}`, `color: ${color}`);
    } else {
      console.info(content);
    }
  },

  /**
   * Open a new window to display a report.
   * @param {string} title - Title of the report.
   * @param {Array} content - Array of objects representing the report content.
   * @returns {boolean} - True if successful, false otherwise.
   */
  async report(title, content) {
    let newWindow = window.open("", "_blank", "width=600,height=750");

    if (newWindow) {
      let reportContent = "";

      content.forEach((obj) => {
        if (typeof obj !== "object") {
          console.error("Content should be an object with key-value pairs.");
          return;
        }

        const keys = Object.keys(obj);
        switch (keys[0].toLowerCase()) {
          case "pass":
            reportContent += fat.template.pass(obj.pass);
            break;
          case "fail":
            reportContent += fat.template.fail(obj.fail);
            break;
          default:
            reportContent += fat.template.default(obj[keys[0]]);
            break;
        }
      });

      newWindow.document.write(fat.template.report(title, reportContent));
      newWindow.document.close();
      return true;
    } else {
      console.error("Failed to open a new window. Please check your browser's popup settings.");
      return false;
    }
  },

  /**
   * Add a log entry to the content list.
   * @param {Array} contentList - Array to collect log entries.
   * @param {object} content - Log entry object with a type.
   * @returns {boolean} - Always returns true.
   */
  async load(contentList, content) {
    contentList.push(content);
    return true;
  },

  /**
   * Wait until an element exists within a specified timeframe.
   * @param {string} element - Selector chain string.
   * @param {number} [maxAttempts=60] - Maximum number of attempts.
   * @param {number} [interval=500] - Interval in milliseconds between attempts.
   * @returns {Promise<Element|boolean>} - The found element or false if not found.
   */
  async exist(element, maxAttempts = 60, interval = 500) {
    let attempts = 0;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (attempts < maxAttempts) {
      const targetElement = util.element(element);

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
   * Poll for an element's existence and set attribute.
   * @param {string} strElement - Selector chain string for the element.
   * @param {string} propName - The name of the element property.
   * @param {string} propValue - The value of the element property.
   * @param {string} eventType - Type of event such as 'change', 'click' and etc
   * @param {number} [maxAttempts=100] - Maximum number of attempts.
   * @param {number} [interval=500] - Interval in milliseconds between attempts.
   * @returns {Promise<boolean>} - True if the element was clicked, false otherwise.
   */
  async set(strElement, propName, propValue, eventType = "change", maxAttempts = 100, interval = 500) {
    let attempts = 0;
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (attempts < maxAttempts) {
      let targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Elements were reached and ready to set", "green");
        targetElement.setAttribute(propName, propValue);
        const event = new Event(eventType, { bubbles: true });
        targetElement.dispatchEvent(event);

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
   * Poll for an element's existence and click it if found.
   * @param {string} strElement - Selector chain string for the element.
   * @param {number} [maxAttempts=100] - Maximum number of attempts.
   * @param {number} [interval=500] - Interval in milliseconds between attempts.
   * @returns {Promise<boolean>} - True if the element was clicked, false otherwise.
   */
  async click(strElement, maxAttempts = 100, interval = 500) {
    let attempts = 0;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (attempts < maxAttempts) {
      const targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Element found and ready to click", "green");
        targetElement.click();
        targetElement.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      } else {
        attempts++;
        fat.log(`Attempting to find element: ${attempts}/${maxAttempts}`);
        await wait(interval);
      }
    }

    fat.log("Maximum number of attempts exceeded", "red");
    return false;
  },

  /**
   * Poll for an element's existence and input text if found.
   * @param {string} strElement - Selector chain string for the element.
   * @param {string} textContent - The text content to input.
   * @param {number} [maxAttempts=100] - Maximum number of attempts.
   * @param {number} [interval=500] - Interval in milliseconds between attempts.
   * @returns {Promise<boolean>} - True if the text was inputted, false otherwise.
   */
  async input(strElement, textContent, maxAttempts = 100, interval = 500) {
    let attempts = 0;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    while (attempts < maxAttempts) {
      const targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Element found and ready for input", "green");
        targetElement.value = textContent;
        targetElement.dispatchEvent(new Event("input", { bubbles: true }));
        targetElement.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      } else {
        attempts++;
        fat.log(`Attempting to find element: ${attempts}/${maxAttempts}`);
        await wait(interval);
      }
    }

    fat.log("Maximum number of attempts exceeded", "red");
    return false;
  },

  /**
   * Poll for an element's existence and select.
   * @param {string} strElement - Selector chain string for the element.
   * @param {string} option - The option items in the selection.
   * @param {string} prop - Could be value, text, innerHTML etc.
   * @param {number} [maxAttempts=100] - Maximum number of attempts.
   * @param {number} [interval=500] - Interval in milliseconds between attempts.
   * @returns {Promise<boolean>} - True if the text was inputted, false otherwise.
   */
  async select(strElement, option, prop = "text", maxAttempts = 100, interval = 500) {
    let attempts = 0;
    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (attempts < maxAttempts) {
      let targetElement = util.element(strElement);

      if (targetElement) {
        fat.log("Elements were reached and ready to select", "green");
        const options = targetElement.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i][prop] === option) {
            // set option
            targetElement.selectedIndex = i;
            const event = new Event("change", { bubbles: true });
            targetElement.dispatchEvent(event);

            return true;
          }
        }
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
   * Pause execution for a specified duration.
   * @param {number} time - The duration to pause.
   * @param {string} [unit="ms"] - Time unit (ms, s, m, h).
   * @returns {Promise<boolean>} - Always returns true.
   */
  async stop(time, unit = "ms") {
    if (typeof time !== "number") {
      console.error("Time must be a number.");
      return false;
    }

    const units = {
      ms: 1,
      s: 1000,
      m: 60000,
      h: 3600000,
    };

    const duration = time * (units[unit] || units.ms);
    fat.log(`Pausing for ${duration / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, duration));
    return true;
  },

  /**
   * Execute a series of asynchronous actions sequentially.
   * @param {Array<Function>} actionList - List of functions to execute.
   * @returns {Promise<boolean>} - True if all actions succeed, false if any fail.
   */
  async action(actionList) {
    for (const func of actionList) {
      const result = await func();
      if (result !== true) {
        console.error(`Function did not return true: ${func.name}`);
        return false;
      }
    }
    return true;
  },

  /**
   * Execute a series of actions in a flow, tracking the status of each.
   * @param {Array<Function>} actionList - List of functions to execute.
   * @returns {Promise<boolean>} - Always returns true.
   */
  async flow(actionList) {
    let status = "init";
    for (const func of actionList) {
      const result = await func(status);
      status = result === true;
    }
    return true;
  },

  template: {
    /**
     * Generate the HTML template for a report.
     * @param {string} title - The title of the report.
     * @param {string} content - The HTML content of the report.
     * @returns {string} - The complete HTML string for the report.
     */
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
    /**
     * Generate the HTML template for a "pass" message.
     * @param {string} content - The content of the "pass" message.
     * @returns {string} - The HTML string for the "pass" message.
     */
    pass(content) {
      return `<h4 class="pass">✓ ${content}</h4>`;
    },
    /**
     * Generate the HTML template for a "fail" message.
     * @param {string} content - The content of the "fail" message.
     * @returns {string} - The HTML string for the "fail" message.
     */
    fail(content) {
      return `<h4 class="fail">✗ ${content}</h4>`;
    },
    /**
     * Generate the default HTML template for a message.
     * @param {string} content - The content of the message.
     * @returns {string} - The HTML string for the message.
     */
    default(content) {
      return `<h4>${content}</h4>`;
    },
  },
};
