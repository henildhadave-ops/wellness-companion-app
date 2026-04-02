# AI Wellness Companion - Mobile App Design

## Overview

The AI Wellness Companion is a compassionate, AI-driven mental health support app designed for users seeking personalized wellness guidance. The app prioritizes user safety, privacy, and ethical mental health support through empathetic AI conversations, session management, mood tracking, and curated wellness resources.

**Core Philosophy:** The app is a wellness tool, not a medical device. It never diagnoses, never replaces therapy, and always maintains clear clinical boundaries with crisis support pathways.

---

## Screen List

### Authentication & Onboarding
1. **Splash Screen** - App branding and loading state
2. **Welcome Screen** - App introduction and value proposition
3. **Sign Up Screen** - Email/password registration with privacy notice
4. **Login Screen** - Email/password login
5. **Onboarding Flow** - Mental health context, preferences, and privacy acknowledgment

### Core Features
6. **Home Dashboard** - Session status, quick stats, call-to-action buttons
7. **AI Chat Screen** - Main conversation interface with session timer
8. **Session Paywall** - Upgrade prompt when free sessions expire
9. **Mood Tracker** - Daily mood logging with emotion selection
10. **Journaling Screen** - Free-form text journaling with AI insights
11. **Resources Library** - Curated wellness articles, meditations, techniques
12. **Profile/Settings** - User preferences, subscription status, privacy controls

### Secondary Screens
13. **Session History** - Past conversations and insights
14. **Subscription Management** - View active subscription, upgrade options
15. **Crisis Support** - Emergency resources and hotline information
16. **Feedback/Support** - App feedback and customer support

---

## Primary Content and Functionality

### 1. Home Dashboard
**Purpose:** Central hub showing user's wellness status and session availability.

**Content:**
- Welcome greeting with user's name
- Session counter (e.g., "2 of 3 free sessions remaining")
- Current mood indicator (if mood logged today)
- Quick stats: total sessions, streak, last check-in
- Primary CTA: "Start Wellness Session" (or "Upgrade" if out of sessions)
- Secondary CTAs: "Log Mood," "Journal," "Browse Resources"

**Functionality:**
- Real-time session counter
- Visual progress indicator
- Quick navigation to all features

### 2. AI Chat Screen
**Purpose:** Main interaction point for AI-driven wellness conversations.

**Content:**
- Session timer (countdown from 30 minutes)
- Chat message history with AI and user messages
- Input field for user messages
- Session controls: pause, end session, help
- Session progress indicator

**Functionality:**
- Real-time message streaming
- Session time tracking (30-minute limit)
- Auto-save conversation history
- Graceful session end when timer expires
- Crisis detection with escalation pathway

### 3. Session Paywall
**Purpose:** Monetization screen when free sessions expire.

**Content:**
- Friendly message: "You've used your free sessions"
- Subscription options:
  - Single session: $5 USD / ₹500 INR
  - Monthly plan (10 sessions): $15 USD / ₹1,500 INR
  - Annual plan (unlimited): $99 USD / ₹9,900 INR
- Benefits highlight: "Unlimited access to AI support"
- Secure payment gateway integration
- "Continue for free" option (limited features)

**Functionality:**
- Secure payment processing
- Session credit allocation
- Subscription status tracking
- Ad display for free users

### 4. Mood Tracker
**Purpose:** Daily emotional check-in with trend visualization.

**Content:**
- Emotion wheel with 8 primary emotions (happy, sad, anxious, calm, etc.)
- Intensity slider (1-10 scale)
- Optional note field
- 7-day mood history chart
- Insights: "You've been more calm this week"

**Functionality:**
- One entry per day
- Historical mood data visualization
- Mood-based resource recommendations
- Export mood data

### 5. Journaling Screen
**Purpose:** Private space for self-reflection and emotional expression.

**Content:**
- Rich text editor
- Date/time stamp
- Optional emotion tag
- Save/publish toggle
- AI-generated reflection prompt
- Previous journal entries list

**Functionality:**
- Auto-save drafts
- Full-text search
- Privacy controls (private/shared)
- AI analysis of journal entries (optional)

### 6. Resources Library
**Purpose:** Curated wellness content and techniques.

**Content:**
- Categorized resources:
  - Meditation & Breathing (audio)
  - Coping Techniques (text + video)
  - Self-Care Tips
  - Crisis Resources
  - Professional Support Directory
- Search and filter functionality
- Bookmarks/favorites
- Ad placements (for free users)

**Functionality:**
- Offline access to core resources
- Audio playback for meditations
- Sharing capabilities
- Ad integration for monetization

### 7. Profile & Settings
**Purpose:** User account and app preferences.

**Content:**
- User profile info (name, email, avatar)
- Subscription status and renewal date
- Session usage statistics
- Privacy & data controls
- Notification preferences
- App theme (light/dark mode)
- Language selection
- About & Legal (Privacy Policy, Terms of Service)

**Functionality:**
- Account management
- Subscription upgrade/downgrade
- Data export
- Account deletion
- Notification settings

---

## Key User Flows

### Flow 1: New User Onboarding
1. User opens app → Splash screen
2. Welcome screen with app value proposition
3. Sign up with email/password
4. Onboarding questionnaire (mental health context, preferences)
5. Privacy acknowledgment and consent
6. Home dashboard with 3 free sessions allocated
7. Prompt to start first session or explore resources

### Flow 2: Starting a Wellness Session
1. User taps "Start Wellness Session" on home
2. Session initialization screen (loading AI)
3. AI greeting and context-setting
4. User-AI conversation (30-minute timer running)
5. Session end options:
   - Natural end (user says goodbye)
   - Timer expires (graceful end with summary)
   - User manually ends session
6. Session summary with key insights
7. Prompt to log mood or journal
8. Return to home dashboard

### Flow 3: Free Sessions Expire → Paywall
1. User completes 3rd free session
2. Home dashboard shows "0 of 3 sessions remaining"
3. CTA button changes to "Upgrade to Continue"
4. User taps upgrade
5. Paywall screen with pricing options
6. User selects plan and completes payment
7. Session credits added to account
8. User can resume sessions immediately

### Flow 4: Mood Tracking & Insights
1. User taps "Log Mood" on home or after session
2. Emotion wheel appears
3. User selects emotion and intensity
4. Optional note added
5. Mood saved with timestamp
6. App suggests related resources
7. Return to home with updated mood indicator

### Flow 5: Crisis Detection & Escalation
1. AI detects crisis language in conversation
2. Gentle intervention: "I'm concerned about your safety"
3. Offer immediate crisis resources:
   - Crisis hotline number (with one-tap call)
   - Crisis text line (with one-tap SMS)
   - Emergency services (911 in US)
4. Option to continue conversation or seek help
5. Session notes flagged for safety review

---

## Color Choices

The app uses a calming, nature-inspired palette designed to evoke trust and wellness:

| Color | Hex | Usage |
|-------|-----|-------|
| **Forest** | #1A3A2A | Primary brand, headers, CTAs |
| **Moss** | #2E5E42 | Secondary accent, highlights |
| **Sage** | #6B9E7A | Tertiary accent, icons |
| **Mist** | #A8C5B0 | Subtle text, borders |
| **Cream** | #F6F1E9 | Background, light surfaces |
| **Parchment** | #EDE6D6 | Secondary background |
| **Amber** | #C8883A | Accent, warmth, CTAs |
| **Charcoal** | #2C2C2C | Primary text |
| **White** | #FFFFFF | Cards, surfaces |

**Emotional Associations:**
- Forest & Moss: Grounding, nature, calm
- Sage: Growth, healing, balance
- Amber: Warmth, support, hope
- Cream & Parchment: Comfort, safety, approachability

---

## Interaction Design Principles

### 1. One-Handed Usage
- All interactive elements positioned within thumb reach (bottom 60% of screen)
- Large touch targets (min 48px height)
- Minimal scrolling required for critical actions

### 2. Emotional Responsiveness
- Warm, encouraging copy throughout
- Gentle error messages (never shame-based)
- Celebratory feedback for milestones (e.g., "Great job logging your mood!")

### 3. Privacy-First Design
- Clear data handling explanations
- Explicit consent for each data collection
- Easy access to privacy controls
- No dark patterns or manipulative design

### 4. Accessibility
- WCAG 2.1 AA compliance
- Screen reader support for all content
- High color contrast (7:1 minimum)
- Large text mode support
- Keyboard navigation support

### 5. Crisis Safety
- Clear escalation pathways visible at all times
- One-tap access to crisis resources
- No judgment language
- Immediate human support options

---

## Session Management Logic

### Free Sessions
- 3 sessions included with sign-up
- 30 minutes per session
- Countdown timer visible during session
- Graceful end when timer expires
- Session history preserved

### Paid Sessions
- Single session: $5 USD / ₹500 INR
- Monthly subscription: $15 USD / ₹1,500 INR (10 sessions)
- Annual subscription: $99 USD / ₹9,900 INR (unlimited)
- Session credits never expire
- Rollover unused sessions to next month

### Session Limits
- Maximum 1 session per day (to encourage healthy spacing)
- Minimum 15 minutes between sessions
- Sessions auto-end at 30 minutes
- User can manually end session anytime

---

## Monetization & Ad Strategy

### Ad Placement (Free Users Only)
1. **Home Dashboard:** Banner ad below session counter
2. **Resources Library:** Interstitial ad between categories
3. **After Session:** Rewarded video ad for bonus session credit
4. **Session Paywall:** Contextual ads for wellness products

### Ad Network Integration
- Google AdMob for primary ad serving
- Mediation layer for fallback networks
- Non-intrusive ad formats (banners, native, rewarded)
- No ads during active AI conversation (preserve UX)

### Premium Ad-Free Experience
- Upgrade to any paid plan removes all ads
- Ad-free experience is key premium benefit

---

## Privacy & Data Architecture

### Data Collected
- User profile (name, email, password hash)
- Session transcripts (encrypted)
- Mood logs (timestamp, emotion, intensity)
- Journal entries (encrypted)
- Usage analytics (session count, feature usage)

### Data Protection
- End-to-end encryption for sensitive data
- HIPAA-aligned security practices
- User data never shared with third parties
- Clear data retention policies
- Easy data export and deletion

### Clinical Boundaries
- App positioned as wellness tool, not medical device
- Clear disclaimers at onboarding and throughout
- Crisis pathways lead to real human support
- No diagnostic language in AI responses
- Regular clinical review of AI prompts

---

## Accessibility Commitments

- WCAG 2.1 AA compliance
- Screen reader support for all interactive elements
- Large-text mode (up to 200% scaling)
- Simplified UI mode for users 50+ or with visual impairments
- Low-bandwidth mode for 2G connections
- No ableist language in AI responses
- Culturally reviewed content for diverse contexts

---

## Success Metrics

- **Engagement:** Daily active users, session completion rate
- **Retention:** 30-day retention, churn rate
- **Monetization:** Conversion rate to paid, ARPU
- **Safety:** Crisis detection accuracy, escalation success
- **Satisfaction:** User ratings, NPS score

---

## Non-Negotiables

The app will never:
- Diagnose mental health conditions
- Claim to replace professional therapy
- Guilt-trip users for missing check-ins
- Use fear-based engagement loops
- Display ads during active AI conversations
- Share user data with third parties
- Use ableist or stigmatizing language
- Ignore crisis signals

These are product-level constraints, baked into every conversation prompt, notification, and line of copy.
