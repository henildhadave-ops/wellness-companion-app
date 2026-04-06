# AI Wellness Companion - Project TODO

## Phase 1: Core Authentication & Onboarding

- [x] Splash screen with app branding and loading state
- [x] Welcome screen with app introduction and value proposition
- [x] Sign up screen with email/password registration
- [x] Login screen with email/password authentication
- [ ] Onboarding flow with mental health context questions
- [x] Privacy acknowledgment and consent screen
- [x] Session allocation (3 free sessions on signup)
- [x] User profile creation and storage

## Phase 2: Home Dashboard & Navigation

- [x] Home dashboard layout with session counter
- [x] Tab bar navigation (Home, Chat, Mood, Journal, Resources, Profile)
- [x] Session status display (X of Y sessions remaining)
- [x] Quick stats display (total sessions, streak, last check-in)
- [x] Primary CTA buttons (Start Session, Log Mood, Journal, Resources)
- [x] Theme colors implementation (forest, moss, sage, amber palette)
- [ ] Dark mode support
- [x] Bottom tab bar with icons

## Phase 3: AI Chat Session Feature

- [x] AI chat screen layout with message history
- [x] Real-time message input and submission
- [x] Session timer (30-minute countdown)
- [x] Message streaming and display
- [x] Session controls (pause, end, help)
- [x] Session auto-end when timer expires
- [ ] Session summary after completion
- [x] Conversation history storage
- [ ] Crisis detection and escalation pathway
- [x] Crisis resources display (hotline, text line, emergency)

## Phase 4: Session Paywall & Monetization

- [ ] Session paywall screen design
- [ ] Pricing options display ($5 single, $15 monthly, $99 annual)
- [ ] INR pricing display (₹500, ₹1,500, ₹9,900)
- [ ] Payment gateway integration (Stripe or similar)
- [ ] Secure payment processing
- [ ] Session credit allocation after purchase
- [ ] Subscription status tracking
- [ ] Upgrade/downgrade functionality
- [ ] Payment history display
- [ ] Ad integration for free users (Google AdMob)
- [ ] Ad placement in home, resources, and paywall screens
- [ ] Rewarded video ads for bonus session credit

## Phase 5: Mood Tracking

- [x] Mood tracker screen with emotion wheel
- [x] 8 primary emotions (happy, sad, anxious, calm, angry, peaceful, hopeful, overwhelmed)
- [x] Intensity slider (1-10 scale)
- [x] Optional mood note field
- [x] Mood history storage (daily limit)
- [x] 7-day mood chart visualization
- [ ] Mood-based insights and recommendations
- [ ] Mood export functionality
- [x] Mood data persistence

## Phase 6: Journaling Feature

- [x] Journaling screen with rich text editor
- [x] Date/time stamp for entries
- [x] Optional emotion tag selection
- [x] Save/publish toggle for privacy
- [ ] AI-generated reflection prompt
- [x] Previous journal entries list
- [ ] Auto-save draft functionality
- [ ] Full-text search in journals
- [ ] Journal entry deletion
- [ ] Journal data encryption

## Phase 7: Resources Library

- [x] Resources library screen layout
- [x] Resource categories (Meditation, Coping Techniques, Self-Care, Crisis, Professional)
- [x] Resource cards with title, description, category
- [x] Search and filter functionality
- [ ] Bookmarks/favorites feature
- [ ] Audio playback for meditations
- [ ] Video playback for techniques
- [ ] Offline access to core resources
- [ ] Resource sharing capability
- [x] Ad placement between categories
- [ ] Resource recommendations based on mood

## Phase 8: Profile & Settings

- [x] Profile screen with user info display
- [ ] User avatar upload
- [x] Subscription status display
- [x] Session usage statistics
- [ ] Privacy & data controls
- [ ] Notification preferences
- [ ] App theme toggle (light/dark)
- [ ] Language selection
- [x] About & Legal section (Privacy Policy, Terms)
- [ ] Data export functionality
- [ ] Account deletion option
- [x] Logout functionality

## Phase 9: Session History & Analytics

- [ ] Session history screen with past conversations
- [ ] Session date, duration, and summary display
- [ ] Session insights and key takeaways
- [ ] Ability to view past session transcripts
- [ ] Session statistics (total sessions, average duration)
- [ ] Mood trends visualization
- [ ] Engagement metrics dashboard

## Phase 10: Crisis Support & Safety

- [ ] Crisis support screen with emergency resources
- [ ] Crisis hotline numbers (US, UK, India, etc.)
- [ ] Crisis text line information
- [ ] Emergency services (911) quick access
- [ ] Safety plan creation tool
- [ ] Trusted contacts feature
- [ ] Crisis detection in AI conversations
- [ ] Automatic escalation when crisis detected
- [ ] Safety review flagging for conversations

## Phase 11: Accessibility & Localization

- [ ] WCAG 2.1 AA compliance audit
- [ ] Screen reader support testing
- [ ] Large text mode (up to 200% scaling)
- [ ] Simplified UI mode option
- [ ] Low-bandwidth mode for 2G
- [ ] Keyboard navigation support
- [ ] High contrast mode support
- [ ] Localization for South Asian, East Asian, African contexts
- [ ] Translation infrastructure setup

## Phase 12: Testing & Quality Assurance

- [ ] Unit tests for auth logic
- [ ] Unit tests for session management
- [ ] Unit tests for mood tracking
- [ ] Integration tests for payment flow
- [ ] End-to-end testing of user flows
- [ ] Crisis detection testing
- [ ] Performance testing (load times, battery usage)
- [ ] Security testing (data encryption, API security)
- [ ] Accessibility testing (screen readers, keyboard)
- [ ] Cross-platform testing (iOS, Android, Web)
- [ ] User acceptance testing

## Phase 13: Deployment & Launch

- [ ] App store submission (Apple App Store)
- [ ] Google Play Store submission
- [ ] Web version deployment
- [ ] Privacy policy finalization
- [ ] Terms of service finalization
- [ ] HIPAA compliance verification
- [ ] Data protection compliance (GDPR, CCPA)
- [ ] Launch marketing materials
- [ ] User onboarding documentation
- [ ] Support documentation

## Phase 14: Post-Launch & Optimization

- [ ] Monitor app performance and crashes
- [ ] Analyze user engagement metrics
- [ ] Gather user feedback
- [ ] A/B test paywall messaging
- [ ] Optimize ad placements and revenue
- [ ] Iterate on AI conversation quality
- [ ] Expand resource library
- [ ] Add community features (future)
- [ ] Integrate professional support directory (future)
- [ ] Add wearable integration (future)

## Known Issues & Bugs

- [ ] (None identified yet - will be updated as development progresses)

## Notes

- Session limit: 30 minutes per session
- Free sessions: 3 at signup
- Paid session: $5 USD / ₹500 INR
- Monthly subscription: $15 USD / ₹1,500 INR (10 sessions)
- Annual subscription: $99 USD / ₹9,900 INR (unlimited)
- Maximum 1 session per day
- Minimum 15 minutes between sessions
- Ad-free experience for paid users
- Crisis pathways must lead to real human support
- App is wellness tool, not medical device
- All data encrypted and private
- No data sharing with third parties


## Phase 10: AI Integration & Crisis Detection

- [x] Create tRPC endpoint for wellness chat with LLM
- [x] Implement system prompt for empathetic mental health support
- [x] Add crisis keyword detection in user messages
- [x] Implement crisis escalation pathway with resources
- [x] Add conversation context management (session history)
- [ ] Implement message streaming for real-time responses
- [x] Add safety guidelines and content filtering
- [ ] Test crisis detection with various scenarios


## Phase 11: Breathing Exercises & Grounding Techniques

- [x] Create breathing exercises screen with timer
- [x] Implement 5-minute uplifting breathing practice (4-4-4 count)
- [x] Add guided breathing phases (settling in, uplifting breath, returning)
- [x] Implement 5-4-3-2-1 grounding technique screen
- [x] Add grounding technique guided walkthrough
- [x] Create timer component for breathing exercises
- [x] Add visual breathing animation (inhale/exhale indicators)
- [ ] Implement audio guidance for breathing (optional)
- [x] Add ability to save favorite exercises
- [ ] Create quick access to exercises from home screen


## Phase 12: Refactor - Integrate Breathing into Resources

- [x] Remove separate "Breathe" tab from navigation
- [x] Add breathing exercises and grounding techniques to Resources tab
- [x] Create category filter for Resources (Meditation, Coping, Self-Care, Breathing, Grounding, Crisis, Professional)
- [x] Update Resources screen to display breathing exercises as cards
- [x] Add modal/navigation to launch breathing exercises from Resources
- [x] Update Resources UI to show all exercise types


## Phase 13: Progressive Muscle Relaxation (PMR) Therapy

- [x] Create PMR context for state management
- [x] Implement PMR guided sequence (Toes → Calves → Thighs → Abdomen → Shoulders/Neck → Face)
- [x] Add 3-step cycle for each muscle group (Focus & Tense, Massage & Release, Rest)
- [ ] Create animated body silhouette SVG with muscle group highlighting
- [ ] Implement tension visualization (warm orange/red glow)
- [ ] Implement release visualization (cool teal/lavender transition)
- [ ] Add massage animation effect (rippling waves, glowing orbs)
- [x] Create breathing circle animation (expands on tense, deflates on release)
- [x] Add progress bar showing journey from feet to head
- [x] Implement Start/Pause button with smooth states
- [x] Add PMR exercise to Resources tab with modal launcher
- [x] Create vitest tests for PMR functionality (27 tests passing)
- [x] Remove breathing tab from navigation entirely


## Phase 14: Fix PMR Timing and Remove Breathing Tab

- [x] Remove breathing tab from tab navigation
- [x] Fix PMR timing for each muscle group phase (5s tense, 7s release, 3s rest)
- [x] Update PMR context with correct durations for all 6 muscle groups
- [x] Test PMR timing accuracy (all 61 tests passing)


## Phase 15: Mindsync Branding & Custom Fonts

- [x] Update app.config.ts with Mindsync branding
- [x] Create pastel yellow and pastel orange color palette
- [x] Install Fredoka and Quicksand fonts
- [x] Update theme.config.js with new colors
- [x] Apply Fredoka font to all headings (home screen)
- [x] Apply Quicksand font to body text (home screen)
- [x] Update tailwind.config.js with font families
- [x] Test branding across all screens (61 tests passing)
