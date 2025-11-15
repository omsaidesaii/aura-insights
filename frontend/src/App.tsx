import { SignedIn, SignedOut } from "@clerk/clerk-react"
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import SocialProof from "@/components/SocialProof"
import FeaturesSection from "@/components/FeaturesSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import ProductShowcase from "@/components/ProductShowcase"
import BenefitsSection from "@/components/BenefitsSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import FAQSection from "@/components/FAQSection"
import Footer from "@/components/Footer"
import Dashboard from "@/components/Dashboard"
import UploadPage from "@/components/UploadPage"
import InsightsPage from "@/components/InsightsPage"
import ReviewExplorerPage from "@/components/ReviewExplorerPage"

function App() {
  return (
    <>
      <SignedOut>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <HeroSection />
            <SocialProof />
            <FeaturesSection />
            <HowItWorksSection />
            <ProductShowcase />
            <BenefitsSection />
            <TestimonialsSection />
            <FAQSection />
          </main>
          <Footer />
        </div>
      </SignedOut>
      <SignedIn>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/reviews" element={<ReviewExplorerPage />} />
        </Routes>
      </SignedIn>
    </>
  )
}

export default App