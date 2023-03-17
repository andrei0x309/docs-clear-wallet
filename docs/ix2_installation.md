---
title: Installation
group: getting-started
description: How to install Clear EVM wallet
templateEngine: njk,md
---

# Installation

You can get the extension from Chrome store at [https://chrome.google.com/webstore/detail/clear-evm-wallet-clw/djlahdpfkflehaepgohnnodmaajabdlg?hl=en&authuser=0](https://chrome.google.com/webstore/detail/clear-evm-wallet-clw/djlahdpfkflehaepgohnnodmaajabdlg?hl=en&authuser=0)

or you can install it from source code.

## Installing from source code

Build the extension:

```shell
$ git clone https://github.com/andrei0x309/clear-wallet
$ cd clear-wallet
& yarn install
$ yarn build
```
<br/><br/>
Then go to [chrome://extensions/](chrome://extensions/) and enable developer mode, then click on "Load unpacked" and select the `dist` folder.
