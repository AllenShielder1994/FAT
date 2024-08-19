# FAT

- ### Front-end
- ### Automation
- ### Test

### Project Introduction

This project is a testing platform developed based on the Tampermonkey or Violentmonkey plugin, designed to simplify and optimize repetitive tasks during the testing process.

### Background and Motivation

In daily testing work, testers often need to perform a large number of repetitive tasks, such as filling out forms, clicking buttons, and verifying data. These repetitive actions are not only time-consuming but also prone to human error, which can lead to inaccurate test results. To enhance testing efficiency and reduce human errors, we developed this automated testing platform.

### Project Goals

- **Reduce Repetitive Tasks**: By replacing manual operations with automated scripts, this platform significantly reduces the steps testers need to perform manually during each test.
- **Improve Test Accuracy**: Automated scripts can execute tasks precisely according to the set rules, avoiding errors caused by human factors and improving the reliability of test results.
- **Increase Testing Efficiency**: By minimizing the time spent on repetitive tasks, testers can focus more on complex testing scenarios and issue analysis.

### Feature Overview

- **Automated Script Execution**: Pre-written scripts automatically complete common testing processes, such as form filling, page navigation, and data validation.
- **Customizable**: Users can customize and extend scripts based on specific testing needs, making it adaptable to different testing scenarios.
- **Cross-Browser Support**: As a project based on Tampermonkey or Violentmonkey, this platform can run in major browsers like Chrome and Firefox, offering broad applicability.

### Use Cases

- **Form Autofill**: Automatically fills out various form fields on test pages, reducing the workload of manual input.
- **Automated Page Operations**: Automatically executes common actions on pages, such as clicking buttons and selecting dropdown menus.
- **Test Result Verification**: Automatically compares the data on test pages with expected results, ensuring the accuracy of tests.

### Summary

The development of this testing platform aims to provide testers with an efficient and reliable tool. By using automated scripts to reduce repetitive tasks and improve test accuracy, this platform ultimately enhances the overall efficiency and quality of testing work. We welcome everyone to use the platform and provide feedback for further improvement and refinement.

##### TODO List Phase 1

- Release a usable basic version version beta 0.1
- Improve the select method
- Add the function of adding test report after completing the test
- Publish all updates to code Repo (upgrade the version to beta 1.0 after the update is completed)

##### Example

```javascript
// ==UserScript==
// @name        FAT_trace_start
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @require     https://raw.githubusercontent.com/AllenShielder1994/FAT/main/FAT.js
// @grant       none
// @version     1.0
// @author      -
// @description 8/16/2024, 5:43:52 PM
// ==/UserScript==

const btnStart =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > eui-multi-panel-tile > div.table-action-container > eui-button:nth-child(1)")';
const nodeType =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("eui-flyout-panel > div > eui-accordion > e-cnom-lib-tree-view-widget").shadowRoot.querySelector("e-cnom-lib-tree-view").shadowRoot.querySelector("eui-tree > e-tree-view-item").shadowRoot.querySelector("li > span > div > span > eui-tooltip")';
const nodeMTAS =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("eui-flyout-panel > div > eui-accordion > e-cnom-lib-tree-view-widget").shadowRoot.querySelector("e-cnom-lib-tree-view").shadowRoot.querySelector("eui-tree > e-tree-view-item > e-tree-view-item:nth-child(2)").shadowRoot.querySelector("li > span > div > span > eui-tooltip")';
const customedNode =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("eui-flyout-panel > div > eui-accordion > e-cnom-lib-tree-view-widget").shadowRoot.querySelector("e-cnom-lib-tree-view").shadowRoot.querySelector("eui-tree > e-tree-view-item > e-tree-view-item:nth-child(2) > e-tree-view-item:nth-child(2)").shadowRoot.querySelector("li > span > div > span > eui-tooltip")';
const sessionName =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("#session-name").shadowRoot.querySelector("#item")';
const profile =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("#profile-name").shadowRoot.querySelector("div > eui-text-field").shadowRoot.querySelector("#item")';
const profileItem =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("#profile-name").shadowRoot.querySelector("div > eui-menu > eui-menu-item:nth-child(1)").shadowRoot.querySelector("#label")';
const btnStartInPanel =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("eui-flyout-panel > eui-button:nth-child(3)")';
const btnContinue =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("#user-id-warning-dialog > eui-button")';

const tickAll =
  'document.querySelector("body > eui-container").shadowRoot.querySelector("main > div > div > div.content > e-application-trace").shadowRoot.querySelector("div > eui-tabs > div:nth-child(2) > e-cnom-application-trace-session").shadowRoot.querySelector("div > e-cnom-start-application-trace").shadowRoot.querySelector("#profile-name")';

const taskList = [
  () => fat.click(btnStart),
  () => fat.click(nodeType),
  () => fat.click(nodeMTAS),
  () => fat.click(customedNode),
  () => fat.input(sessionName, Date.now()),
  () => fat.click(profileItem),
  () => fat.click(btnStartInPanel),
  () => fat.click(btnContinue),
];

const testthing = fat.action(taskList);
```
