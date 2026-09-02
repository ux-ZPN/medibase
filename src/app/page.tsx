import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Play,
  AlertTriangle,
  Clock,
  BookOpen,
  Lock,
  Zap,
  CalendarCheck,
} from "lucide-react";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* ==================== NAVBAR / HEADER ==================== */}
      <header className="site-header">
        <div className="nav-shell">
          {/* Brand with logo.png */}
          <Link className="brand" href="/" aria-label="MediBase home">
            <img
              src="/logo.png"
              alt="MediBase Logo"
              className="brand-logo"
            />
            <span className="brand-name">MediBase</span>
          </Link>

          {/* Navigation links (clean, no underlines) */}
          <nav className="primary-nav hidden md:flex" aria-label="Primary navigation">
            <a className="nav-link" href="#about">
              About us
            </a>
            <a className="nav-link" href="#Ourmission">
              Our Mission
            </a>
            <a className="nav-link" href="#why-medibase">
              Why Medibase
            </a>
            <a className="nav-link" href="#workflow">
              WorkFlow
            </a>
            <a className="nav-link" href="#how-it-works">
              How it Works
            </a>
            <Link className="nav-link" href="/features">
              Features
            </Link>
          </nav>

          {/* Header call to action */}
          <div className="nav-actions">
            <Link className="button button-primary gap-1.5" href="/role-select">
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== MAIN PAGE CONTENT ==================== */}
      <main id="main-content">
        {/* ==================== HERO SECTION ==================== */}
        <section className="hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero-copy" id="about">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Secure Longitudinal Records
            </div>
            <h1 id="hero-title">
              Unified Medical<br />
              History.<br />
              <span>Instantly Accessible.</span>
            </h1>

            <p className="body-copy">
              MediBase bridges the gap in healthcare data. Provide immediate,
              secure access to comprehensive patient histories via QR code,
              empowering faster and safer clinical decisions.
            </p>

            {/* Hero buttons */}
            <div className="hero-actions" id="get-started">
              <Link className="button button-primary shadow-md" href="/role-select">
                Get started
              </Link>
              <a className="button button-secondary" href="#workflow">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>See how it works</span>
              </a>
            </div>
          </div>

          {/* Hero image container */}
          <div className="image-frame hero-image" aria-label="MediBase hero banner">
            <img
              src="/banner-1.jpg"
              alt="MediBase healthcare professionals using unified patient system"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* ==================== OUR MISSION SECTION ==================== */}
        <div className="connected-wrapper">
          <section
            className="connected section-shell"
            id="Ourmission"
            aria-labelledby="connected-title"
          >
            <div className="section-copy">
              <p className="eyebrow">OUR MISSION</p>
              <h2 id="connected-title">Empowering care through connected data.</h2>
              <p className="body-copy">
                We believe that vital medical information shouldn&apos;t be trapped in silos.
                MediBase was founded by healthcare professionals who experienced
                firsthand the risks of treating patients without a complete medical history.
                <br />
                <br />
                Our platform is designed to be the secure bridge between disparate EHR
                systems, giving patients control over their data and providers the context
                they need to deliver exceptional care.
              </p>
            </div>

            {/* Supporting image containers */}
            <div className="connected-images">
              <div className="image-frame small-image image-one">
                <img
                  src="/small-section1.jpg"
                  alt="Doctor reviewing digital records"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="image-frame small-image image-two">
                <img
                  src="/small-section2.jpg"
                  alt="Connected healthcare facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>

        {/* ==================== FRAGMENTED CARE SECTION ==================== */}
        <section
          className="cost section-shell"
          id="why-medibase"
          aria-labelledby="cost-title"
        >
          <p className="eyebrow center" style={{ color: "#e11d48" }}>
            THE CHALLENGE
          </p>
          <h2 className="center" id="cost-title">
            The High Cost of Fragmented Care
          </h2>
          <p className="center section-lead">
            When medical records are scattered across different providers, patient safety is
            compromised and valuable clinical time is lost.
          </p>

          {/* Problem cards */}
          <div className="card-grid cost-grid">
            <article className="info-card tint-pink">
              <span className="card-icon">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </span>
              <h3>Adverse Events</h3>
              <p>
                Missing allergy or medication data can lead to dangerous drug interactions
                during emergency and routine care.
              </p>
            </article>

            <article className="info-card tint-gray">
              <span className="card-icon">
                <Clock className="w-6 h-6 text-slate-500" />
              </span>
              <h3>Wasted Time</h3>
              <p>
                Clinicians spend hours tracking down faxes and records from previous
                providers instead of treating patients.
              </p>
            </article>

            <article className="info-card tint-gray">
              <span className="card-icon">
                <BookOpen className="w-6 h-6 text-slate-500" />
              </span>
              <h3>Redundant Testing</h3>
              <p>
                Without access to recent lab results or imaging, expensive and invasive
                tests are often unnecessarily repeated.
              </p>
            </article>
          </div>
        </section>

        {/* ==================== HOW TO USE / BENEFITS SECTION ==================== */}
        <div className="better-wrapper">
          <section
            className="better section-shell"
            id="how-it-works"
            aria-labelledby="better-title"
          >
            <p className="eyebrow center">A BETTER WAY</p>
            <h2 className="center" id="better-title">
              How to Use &amp; Why It&apos;s Better
            </h2>

            {/* Numbered use steps */}
            <div className="card-grid use-grid">
              <article className="step-card">
                <span className="step-number">1</span>
                <h3>Scan QR</h3>
                <p>
                  Patient presents their secure MediBase QR code upon arrival at the clinic
                  or emergency department.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">2</span>
                <h3>Access History</h3>
                <p>
                  Authorized providers instantly view comprehensive records, allergies,
                  vital signs, and active medications.
                </p>
              </article>

              <article className="step-card">
                <span className="step-number">3</span>
                <h3>Update Records</h3>
                <p>
                  New clinical notes, diagnoses, and prescriptions sync seamlessly back to
                  the patient&apos;s longitudinal timeline.
                </p>
              </article>
            </div>

            {/* Benefit summaries */}
            <div className="benefit-grid">
              <article>
                <span className="benefit-icon">
                  <Lock className="w-5 h-5 text-[#087f80]" />
                </span>
                <h3>Uncompromising Security</h3>
                <p>
                  Enterprise-grade encryption and consent-driven access ensure patient data
                  is always protected and accessible only to authorized personnel.
                </p>
              </article>

              <article>
                <span className="benefit-icon">
                  <Zap className="w-5 h-5 text-[#087f80]" />
                </span>
                <h3>Lightning Speed</h3>
                <p>
                  Eliminate wait times for faxes and complex portal integrations. Get critical
                  data in seconds, not hours.
                </p>
              </article>

              <article>
                <span className="benefit-icon">
                  <CalendarCheck className="w-5 h-5 text-[#087f80]" />
                </span>
                <h3>Absolute Accuracy</h3>
                <p>
                  Make clinical decisions based on a complete, unified history, significantly
                  reducing diagnostic errors.
                </p>
              </article>
            </div>
          </section>
        </div>

        {/* ==================== WORKFLOW SECTION ==================== */}
        <div className="workflow-wrapper">
          <section className="workflow section-shell" id="workflow" aria-labelledby="workflow-title">
            <div className="workflow-header">
              <h2 id="workflow-title">How MediBase Works</h2>
              <p>
                A seamless flow from arrival to documentation, engineered for modern clinical workflows.
              </p>
            </div>

            <div className="workflow-steps" aria-label="How MediBase works">
              <div className="workflow-step">
                <span className="workflow-number">1</span>
                <div className="workflow-copy">
                  <h3>Patient Arrival</h3>
                  <p>Patient shares MediBase ID or QR token.</p>
                </div>
              </div>

              <div className="workflow-step">
                <span className="workflow-number">2</span>
                <div className="workflow-copy">
                  <h3>Authorization</h3>
                  <p>Provider requests access; patient approves.</p>
                </div>
              </div>

              <div className="workflow-step">
                <span className="workflow-number">3</span>
                <div className="workflow-copy">
                  <h3>Review Timeline</h3>
                  <p>Provider views unified medical history.</p>
                </div>
              </div>

              <div className="workflow-step">
                <span className="workflow-number">4</span>
                <div className="workflow-copy">
                  <h3>Documentation</h3>
                  <p>New visit is securely appended.</p>
                </div>
              </div>

              <div className="workflow-step">
                <span className="workflow-number">5</span>
                <div className="workflow-copy">
                  <h3>Audit &amp; Log</h3>
                  <p>All access recorded immutably.</p>
                </div>
              </div>
            </div>

            {/* Centered Call to Action Button */}
            <div className="w-full flex justify-center items-center my-14 text-center">
              <Link
                href="/role-select"
                className="button button-primary inline-flex items-center justify-center gap-3 text-base px-8 py-3.5 shadow-lg"
              >
                <span>Launch MediBase Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="site-footer" id="partners">
        <div className="footer-brand">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.png" alt="MediBase Logo" className="h-8 w-auto object-contain" />
            <span className="brand-name font-bold text-xl">MediBase</span>
          </div>
          <p>Connecting people, information, and healthcare with privacy and speed.</p>
          <small>© 2026 MediBase Secure Health Systems</small>
        </div>

        {/* Footer navigation columns */}
        <div className="footer-links">
          <div>
            <strong>PLATFORM</strong>
            <a href="#about">About us</a>
            <a href="#why-medibase">Problem</a>
            <a href="#how-it-works">Solution</a>
            <Link href="/features">Features</Link>
          </div>

          <div>
            <strong>ACCESS</strong>
            <Link href="/patient/login">Patient Portal</Link>
            <Link href="/staff/login">Hospital Staff</Link>
            <Link href="/role-select">Role Gateway</Link>
          </div>

          <div>
            <strong>LEGAL &amp; SECURITY</strong>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security &amp; HIPAA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
