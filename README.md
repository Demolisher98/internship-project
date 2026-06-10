# Aeonian Packages
### AI-Powered B2B Voice Ordering & Inventory Management

> Built for B Sai Pavan — a disposable packaging distributor at Eat Street, Vijayawada — as part of the OkCredit Future Founders Internship 2026.

## The Problem

B Sai Pavan supplies disposable packaging products to 30–40 food vendors at Eat Street every evening during the 7–9 PM peak window. Every order was tracked on paper and from memory — vendor name, items, quantities, dues — across a chaotic 2-hour rush. That process took 60–90 minutes per evening and was entirely manual.
OkCredit already exists as a ledger tool. It has no voice input, no inventory layer, and no multi-item vendor order flow. That gap is what Aeonian Packages solves.

## What We Built

A production-grade PWA (Progressive Web App) built simultaneously while having real conversations with the merchant. Voice ordering was the entry point. Financial intelligence is the destination.

### Core Features

**🎙️ AI Voice Ordering (Gemini 2.5 Flash)**
Raw audio is recorded via MediaRecorder API with echo cancellation and noise suppression, then sent directly to Gemini 2.5 Flash as a base64 audio file. Gemini handles transcription and structured JSON extraction in a single API call — no intermediate STT step. Handles Telugu, Tanglish, long order strings, and noisy street environments natively.

**📋 Manual Order Entry**
Every vendor card has a `+ Order` button for when Gemini is unavailable or connectivity is poor. Opens the same confirmation modal with the vendor pre-selected. Identified as a requirement during real usage at Eat Street — vendors occasionally return items mid-order.

**✕ Item Return Removal**
Each order item on a vendor card has a remove button. Tapping it restores the stock, subtracts from the vendor's due, and saves to Firebase instantly.

**📲 WhatsApp Bill Generator**
One tap generates a professional itemised bill image via Canvas API — vendor name, items, quantities, today's total, and outstanding due — then shares it directly via the Web Share API. Works offline, no external library. Gives vendors a daily record and creates a natural habit loop for Sai Pavan to open the app every evening.

**☁️ Firebase Firestore Cloud Sync**
All data syncs to Firestore in real time. Multi-device access, automatic timestamps on every write (used for usage streak evidence), and archive support for monthly resets.

**📦 Inventory Management**
Full stock tracking with buy price / sell price per product, max stock limits, low stock alerts (<10%), and purchase logs with monthly filtering.

**📊 Business Analytics**
Monthly sales, profit, collection rate, product movement rankings, vendor due leaderboard, and inventory risk assessment.

**🏠 PWA — Installs Like a Native App**
Add to home screen on Android or iOS. Opens fullscreen with no browser bar. No app store required.


## Tech Stack

| Layer    |                 Technology                         |
|----------|----------------------------------------------------|
| Frontend | Vite, Vanilla JS, CSS                              |
| AI / STT | Gemini 2.5 Flash (multimodal audio)                |
| Database | Firebase Firestore                                 |
| Hosting  | GitHub Pages                                       |
| PWA      | Web App Manifest, Web Share API, MediaRecorder API |


## Why It Can't Exist Without an LLM

Traditional STT fails at Eat Street — noisy open-air market, Telugu + Tanglish mixed speech, long order strings with small pauses between items. Gemini receives the raw audio waveform and simultaneously transcribes and extracts structured JSON (vendor name, items, quantities) in one call. No rule-based system or traditional STT pipeline can do this reliably in this environment.

---

## Development Journey

| Week | What Happened |

| W1–W2 | Identified B Sai Pavan at Eat Street, observed the paper-based order flow |
| W3 | Locked in the problem, built first prototype with Web Speech API |
| W4 | Replaced Web Speech API with MediaRecorder + Gemini multimodal audio after Sai Pavan flagged STT failures on long Telugu order strings. Migrated from jsonbin.io to Firebase Firestore. Added manual order entry, item returns, WhatsApp bill generator, PWA support |


## Live App

🔗 [https://demolisher98.github.io/internship-project/]

---

## Team

Built by:
G Sankar ganesh  - NIT ANDHRA PRADESH
P Prabhas        - VIGNAN UNIVERSITY
P Suchendra Kumar- BITS HYDERABAAD
Merchant: **B Sai Pavan** — Aeonian Packages, Eat Street, Vijayawada.
