// src/background.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId })
})
