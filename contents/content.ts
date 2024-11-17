// src/content.ts
import type { PlasmoCSConfig } from "plasmo"
import type { PatientFormData } from "../components/index"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// State management
let isSelecting = false
let currentField: keyof PatientFormData | null = null
let lastHighlightedElement: HTMLElement | null = null
let observers: { [key: string]: MutationObserver } = {}

// Highlighting styles
const HIGHLIGHT_STYLES = {
  backgroundColor: 'rgba(66, 133, 244, 0.1)',
  outline: '2px solid #4285f4',
  cursor: 'pointer',
  transition: 'all 0.2s'
}

// Helper functions for element highlighting
function addHighlightStyles(element: HTMLElement) {
  const originalStyles = {}
  Object.entries(HIGHLIGHT_STYLES).forEach(([key, value]) => {
    originalStyles[key] = element.style[key]
    element.style[key] = value
  })
  return originalStyles
}

function removeHighlightStyles(element: HTMLElement, originalStyles = {}) {
  Object.keys(HIGHLIGHT_STYLES).forEach(key => {
    element.style[key] = originalStyles[key] || ''
  })
}

// Event listeners management
function addListeners() {
  document.body.addEventListener('mouseover', handleMouseOver)
  document.body.addEventListener('mouseout', handleMouseOut)
  document.body.addEventListener('click', handleClick, { capture: true })
}

function removeListeners() {
  document.body.removeEventListener('mouseover', handleMouseOver)
  document.body.removeEventListener('mouseout', handleMouseOut)
  document.body.removeEventListener('click', handleClick, { capture: true })
}

// Event handlers
function handleMouseOver(e: MouseEvent) {
  if (!isSelecting) return
  const target = e.target as HTMLElement
  if (target === document.body) return
  
  lastHighlightedElement = target
  addHighlightStyles(target)
}

function handleMouseOut(e: MouseEvent) {
  if (!isSelecting) return
  const target = e.target as HTMLElement
  if (target === lastHighlightedElement) {
    removeHighlightStyles(target)
    lastHighlightedElement = null
  }
}

function handleClick(e: MouseEvent) {
  if (!isSelecting || !currentField) return
  e.preventDefault()
  e.stopPropagation()
  
  const target = e.target as HTMLElement
  if (target === document.body) return
  
  const xpath = getXPath(target)
  console.log(`Selected element for ${currentField}:`, xpath)
  
  // Send selection back to sidepanel
  chrome.runtime.sendMessage({
    type: "DATA_SOURCE_SELECTED",
    field: currentField,
    xpath
  })

  // Setup monitoring for this element
  setupMonitoring(currentField, target)
  
  // Cleanup
  isSelecting = false
  currentField = null
  removeHighlightStyles(target)
  removeListeners()
}

// XPath generation
function getXPath(element: HTMLElement): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }
  
  const parts: string[] = []
  let current: HTMLElement | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let step = current.nodeName.toLowerCase()
    
    if (current.parentNode) {
      const siblings = Array.from(current.parentNode.children)
      const similarSiblings = siblings.filter(sibling => 
        sibling.nodeName.toLowerCase() === step
      )
      
      if (similarSiblings.length > 1) {
        const index = similarSiblings.indexOf(current) + 1
        step += `[${index}]`
      }
    }
    
    parts.unshift(step)
    current = current.parentNode as HTMLElement
  }

  return `/${parts.join('/')}`
}

// Element value extraction
function getElementValue(element: HTMLElement): string {
  if (element instanceof HTMLInputElement || 
      element instanceof HTMLTextAreaElement) {
    if (element.type === 'radio') {
      const name = element.name
      const selectedRadio = document.querySelector(
        `input[name="${name}"]:checked`
      ) as HTMLInputElement
      return selectedRadio ? selectedRadio.value : ''
    }
    return element.value
  }
  
  if (element instanceof HTMLSelectElement) {
    return element.options[element.selectedIndex]?.text || ''
  }

  // Handle nested form elements
  const formElement = element.querySelector('input, select, textarea')
  if (formElement) {
    return getElementValue(formElement as HTMLElement)
  }
  
  return element.textContent?.trim() || ''
}

// Monitoring setup
function setupMonitoring(field: keyof PatientFormData, element: HTMLElement) {
  // Clean up existing observer
  if (observers[field]) {
    observers[field].disconnect()
  }

  const observer = new MutationObserver(() => {
    const value = getElementValue(element)
    chrome.runtime.sendMessage({
      type: "DATA_UPDATED",
      field,
      data: value
    })
  })

  // Configure observation
  observer.observe(element, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  })

  // Store observer reference
  observers[field] = observer

  // Set up additional event listeners for form elements
  if (element instanceof HTMLSelectElement ||
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement) {
    element.addEventListener('change', () => {
      const value = getElementValue(element)
      chrome.runtime.sendMessage({
        type: "DATA_UPDATED",
        field,
        data: value
      })
    })
  }

  // Send initial value
  const initialValue = getElementValue(element)
  chrome.runtime.sendMessage({
    type: "DATA_UPDATED",
    field,
    data: initialValue
  })
}

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message)

  if (message.type === "SELECT_DATA_SOURCE") {
    isSelecting = true
    currentField = message.field
    addListeners()
    sendResponse({ success: true })
  }
  
  if (message.type === "SETUP_DATA_SOURCE_MONITORING") {
    message.dataSources.forEach(({ name, xpath }) => {
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLElement

      if (element) {
        setupMonitoring(name, element)
      }
    })
    sendResponse({ success: true })
  }
})

// Cleanup
window.addEventListener('beforeunload', () => {
  Object.values(observers).forEach(observer => observer.disconnect())
})

console.log("Patient form data scraper content script loaded")