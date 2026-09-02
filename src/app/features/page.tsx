import React from "react";
import Link from "next/link";
import "../../styles/landing.css";

export default function FeaturesPage() {
  return (
    <div className="landing-wrapper features-body min-h-screen flex flex-col justify-between">
      {/* ==================== NAVBAR ==================== */}
      <header className="site-header">
        <div className="nav-shell">
          <Link className="brand" href="/" aria-label="MediBase home">
            <img
              src="/logo.png"
              alt="MediBase Logo"
              className="brand-logo"
            />
            <span className="brand-name">MediBase</span>
          </Link>

          <nav className="primary-nav hidden md:flex" aria-label="Primary navigation">
            <Link className="nav-link" href="/#about">
              About us
            </Link>
            <Link className="nav-link" href="/#Ourmission">
              Our Mission
            </Link>
            <Link className="nav-link" href="/#why-medibase">
              Why Medibase
            </Link>
            <Link className="nav-link" href="/#workflow">
              WorkFlow
            </Link>
            <Link className="nav-link" href="/#how-it-works">
              How it Works
            </Link>
            <Link className="nav-link is-active" href="/features">
              Features
            </Link>
          </nav>

          <div className="nav-actions">
            <Link className="button button-primary" href="/role-select">
              <span>Get started</span>
              <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== MAIN FEATURES CONTENT ==================== */}
      <main className="features-page flex-1">
        <section className="feature-hero section-shell" aria-labelledby="features-title">
          <div className="feature-intro">
            <p className="eyebrow center">Platform Features</p>
            <div className="heading-with-icons" aria-label="Medibase features title">
              <span className="heading-icon">
                <i className="fa-solid fa-user-doctor"></i>
              </span>
              <h1 id="features-title">Built for Safer, Faster Care</h1>
              <span className="heading-icon">
                <i className="fa-solid fa-heart-pulse"></i>
              </span>
            </div>
            <p className="feature-subtitle">
              Every feature is designed to unify patient data, reduce delays, and help care teams
              act with absolute clinical confidence.
            </p>
          </div>
        </section>

        <section className="feature-grid section-shell" aria-label="Medibase product features">
          <article className="feature-card">
            <div className="card-top">
              <span className="feature-number">01</span>
              <span className="feature-icon">
                <i className="fa-solid fa-qrcode"></i>
              </span>
            </div>
            <h3>Scan. Identify. Connect.</h3>
            <p>
              Instantly identify patients through a unique MediBase ID and QR code,
              enabling a quick and secure start to the healthcare record workflow.
            </p>
          </article>

          <article className="feature-card">
            <div className="card-top">
              <span className="feature-number">02</span>
              <span className="feature-icon">
                <i className="fa-solid fa-notes-medical"></i>
              </span>
            </div>
            <h3>One Record. Every Visit.</h3>
            <p>
              Healthcare providers can contribute new visits and medical reports to the
              patient’s longitudinal record, keeping their medical history continuously
              updated across care journeys.
            </p>
          </article>

          <article className="feature-card">
            <div className="card-top">
              <span className="feature-number">03</span>
              <span className="feature-icon">
                <i className="fa-solid fa-timeline"></i>
              </span>
            </div>
            <h3>Your Health Story, All in One Timeline</h3>
            <p>
              A unified chronological timeline brings together visits, diagnoses,
              prescriptions, investigations, clinical notes, and medical reports.
            </p>
          </article>

          <article className="feature-card">
            <div className="card-top">
              <span className="feature-number">04</span>
              <span className="feature-icon">
                <i className="fa-solid fa-eye"></i>
              </span>
            </div>
            <h3>See What Matters, Faster</h3>
            <p>
              Authorized healthcare providers get a focused Clinical Snapshot of recent
              diagnoses, medications, investigations, important clinical information,
              and the latest visit.
            </p>
          </article>

          <article className="feature-card">
            <div className="card-top">
              <span className="feature-number">05</span>
              <span className="feature-icon">
                <i className="fa-solid fa-truck-medical"></i>
              </span>
            </div>
            <h3>Critical Care Without Delay</h3>
            <p>
              A separate, controlled emergency-access workflow helps authorized providers
              access critical patient information when immediate medical attention is required.
            </p>
          </article>

          <article className="feature-card">
            <div className="card-top">
              <span className="feature-number">06</span>
              <span className="feature-icon">
                <i className="fa-solid fa-clipboard-list"></i>
              </span>
            </div>
            <h3>Every Access Leaves a Trail</h3>
            <p>
              Sensitive actions and access events are securely recorded, creating
              transparency, accountability, and a complete audit history.
            </p>
          </article>
        </section>

        {/* Centered Call to Action Button */}
        <div className="w-full flex justify-center items-center my-14 text-center">
          <Link
            href="/role-select"
            className="button button-primary inline-flex items-center justify-center gap-3 text-base px-8 py-3.5 shadow-lg"
          >
            <span>Get Started with MediBase</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
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

        <div className="footer-links">
          <div>
            <strong>PLATFORM</strong>
            <Link href="/#about">About us</Link>
            <Link href="/#why-medibase">Problem</Link>
            <Link href="/#how-it-works">Solution</Link>
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
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/security-standards">Security &amp; HIPAA</Link>
            <Link href="/contact">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
