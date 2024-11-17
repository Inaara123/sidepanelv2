// src/sidepanel.tsx
import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User
} from "firebase/auth"
import { auth } from "~firebase"
import { Container, ErrorText, Title } from "./components/StyledComponents"
import { Tabs } from "./components/Tabs"
import { LoginForm } from "./components/LoginForm"
import { WebsiteConfirm } from "./components/WebsiteConfirm"
import { PatientForm } from "./components/PatientForm"
import { FieldMapping } from "./components/FieldMapping"
import { Header } from "./components/Header"
import { signOut } from "firebase/auth"
import type { PatientFormData, XPathData } from "./components/index"

const storage = new Storage()

const initialFormData: PatientFormData = {
  patientName: '',
  address: '',
  mobileNumber: '',
  age: '',
  doctorName: '',
  doctorDepartment: '',
  bookingType: '',
  gender: '',
  referralSource: ''
}

function SidePanel() {
  // Auth states
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")

  // Website states
  const [savedWebsite, setSavedWebsite] = useState("")
  const [currentWebsite, setCurrentWebsite] = useState("")
  const [showWebsiteConfirm, setShowWebsiteConfirm] = useState(false)

  // Form states
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home')
  const [formData, setFormData] = useState<PatientFormData>(initialFormData)
  const [xpaths, setXPaths] = useState<XPathData>({})

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setIsLoading(false)

      if (user) {
        // Load saved website configuration
        const savedSite = await storage.get("savedWebsite")
        setSavedWebsite(savedSite)

        // Get current website
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
        const url = new URL(tabs[0].url)
        const domain = url.hostname
        setCurrentWebsite(domain)

        if (!savedSite) {
          setShowWebsiteConfirm(true)
        }

        // Load saved XPaths and form data
        const savedXPaths = await storage.get("xpaths")
        if (savedXPaths) {
          setXPaths(savedXPaths)
          // Setup monitoring for saved xpaths
          setupFieldMonitoring(savedXPaths)
        }
      }
    })

    // Listen for data updates from content script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "DATA_UPDATED") {
        setFormData(prev => ({
          ...prev,
          [message.field]: message.data
        }))
      }
    })

    return () => unsubscribe()
  }, [])
  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Optionally clear any stored data
      await storage.clear()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      console.error("Auth error:", error)
      setError(isRegistering ? 
        "Failed to create account. Email might be in use or invalid." : 
        "Invalid email or password."
      )
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Here you can add your form submission logic
  }

  const handleConfirmWebsite = async () => {
    await storage.set("savedWebsite", currentWebsite)
    setSavedWebsite(currentWebsite)
    setShowWebsiteConfirm(false)
  }

  const handleElementSelect = (field: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "SELECT_DATA_SOURCE",
        field
      })
    })

    // Listen for the xpath response
    chrome.runtime.onMessage.addListener(function listener(message) {
      if (message.type === "DATA_SOURCE_SELECTED") {
        const newXPaths = {
          ...xpaths,
          [field]: message.xpath
        }
        setXPaths(newXPaths)
        storage.set("xpaths", newXPaths) // Save xpaths
        setupFieldMonitoring(newXPaths)
        chrome.runtime.onMessage.removeListener(listener)
      }
    })
  }

  const setupFieldMonitoring = (pathData: XPathData) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "SETUP_DATA_SOURCE_MONITORING",
        dataSources: Object.entries(pathData).map(([field, xpath]) => ({
          name: field,
          xpath
        }))
      })
    })
  }

  if (isLoading) {
    return <Container>Loading...</Container>
  }

  if (!user) {
    return (
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        error={error}
        onSubmit={handleAuthSubmit}
      />
    )
  }

  if (showWebsiteConfirm) {
    return (
      <WebsiteConfirm
        userEmail={user.email}
        currentWebsite={currentWebsite}
        onConfirm={handleConfirmWebsite}
      />
    )
  }

  if (savedWebsite && currentWebsite !== savedWebsite) {
    return (
      <WebsiteConfirm
        userEmail={user.email}
        currentWebsite={currentWebsite}
        savedWebsite={savedWebsite}
        onConfirm={handleConfirmWebsite}
        showError={true}
      />
    )
  }

  return (
    <Container>
    <Header onLogout={handleLogout} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'home' ? (
        <PatientForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <FieldMapping
          xpaths={xpaths}
          onElementSelect={handleElementSelect}
        />
      )}
    </Container>
  )
}

export default SidePanel