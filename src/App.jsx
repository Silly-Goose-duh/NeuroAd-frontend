import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LandingTwoPage from './pages/LandingTwoPage.jsx'
import DemoPage from './pages/DemoPage.jsx'
import { SignupPage, SurveyPage } from './pages/AccountPages.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CreativeAnalysisPage from './pages/CreativeAnalysisPage.jsx'
import AnalysisResultsPage from './pages/AnalysisResultsPage.jsx'
import { CampaignHistoryPage, ConnectSocialsPage, TrendAnalysisPage } from './pages/CampaignPages.jsx'
import { ProfilePage, SettingsPage } from './pages/AccountSettingsPages.jsx'

function RouteContent() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 80)
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.hash])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/landing2" element={<LandingTwoPage />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<SignupPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/creative-analysis" element={<CreativeAnalysisPage />} />
      <Route path="/campaign-history" element={<CampaignHistoryPage />} />
      <Route path="/trend-analysis" element={<TrendAnalysisPage />} />
      <Route path="/connect-socials" element={<ConnectSocialsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/results/text" element={<AnalysisResultsPage />} />
      <Route path="/results/audio" element={<AnalysisResultsPage />} />
      <Route path="/results/video" element={<AnalysisResultsPage />} />
      <Route path="/results/image" element={<AnalysisResultsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return <BrowserRouter><RouteContent /></BrowserRouter>
}
