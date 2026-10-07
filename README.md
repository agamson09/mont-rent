# 🌴 DreamDesk — Interactive Workspace Designer in Bali
> **A product-first, visual workspace configurator built for [monis.rent](https://monis.rent/) & Desent.**  
> *Skip boring catalogs. Build your dream office setup visually, get hyped, and rent it for your Bali villa in under 60 seconds.*

---

## 🚀 Live Demo & Repository
* **Live Deployment**: Deployed on [Vercel](https://vercel.com)
* **GitHub Repository**: [https://github.com/agam-r/DreamDesk](https://github.com/agam-r/DreamDesk)
* **Collaborator**: `desent-bot` (Read access granted)

---

## 📖 Product Vision & The "Why"

When a freelance software engineer or startup founder lands at Ngurah Rai Airport, checks into their villa in Canggu or Pererenan, and has a sprint starting on Monday:
- They **do not** want to download a clunky PDF catalog.
- They **do not** want to browse an uninspired spreadsheet with dimension tables.
- They **want to feel the excitement** of creating their ideal workspace: an electric standing desk with warm Indonesian teak wood, an ergonomic aero-mesh chair built for tropical humidity, dual 4K monitors on gas-spring arms, a plant on the desk, an espresso bar, and a surfboard propped against the villa wall ready for dawn patrol.

**DreamDesk** replaces the conventional e-commerce funnel with a **"Living Visual Canvas"** where every click instantly updates their setup in real-time.

---

## ✨ Key Features

### 1. 3D Interactive Workspace Simulator (Three.js WebGL)
* **Real 3D Spatial Geometry & Proportions**: Desks, chairs, displays, and accessories rendered in physical 3D dimensions with PBR materials (Indonesian Teak wood, dark walnut, brushed steel, mesh elastomer, nappa leather).
* **360° Orbit & Camera Controls**: Free rotate around the workstation, zoom in on keyboard and display details, or use 1-click camera presets:
  * 📐 **45° Studio Isometric**
  * 👁️ **Front Eye-Level Work View**
  * 🖥️ **Desk Top-Down Focus**
  * 🏄 **Full Room Overview**
* **Motorized Standing Desk Elevation Simulator**: Toggle between *Sitting (74 cm)* and *Standing (106 cm)* with real-time smooth motorized vertical lift animation!
* **Realistic Dynamic Lighting & Soft Shadows**: Powered by `PCFSoftShadowMap`. Directional tropical sunlight casts authentic soft shadows across the villa hardwood floor. ScreenBar and task lamps project real 3D spotlights onto the desk surface.
* **Atmosphere Toggles**:
  * **Villa Backdrops**: Switch between *Villa Pool & Deck*, *Ubud Rice Terrace*, and *Minimalist Loft*.
  * **Lighting Modes**: *Day Mode (☀️)*, *Sunset Golden Hour (🌅)*, and *Night Focus Mode (🌙)*.
* **2D Blueprint Fallback Mode**: Toggle anytime between 3D WebGL Simulator and 2D Sketch Blueprint.

### 2. Bali Nomad Lifestyle Add-ons (The Sketch Highlights)
* ☕ **Coffee Station**: De'Longhi Dedica espresso machine + weekly delivery of fresh Bali Kintamani beans.
* 🏄 **Island Gear**: Echo 6'2" retro fish surfboard propped against the wall.
* 🛋️ **Relax Zone**: Sun-bleached linen oversized bean bag for casual code reviews.
* 🛵 **Island Wheels**: Canggu nomad matte helmet & NMAX / Vespa magnetic key dock.

### 3. 1-Click Curated Nomad Presets
Instant high-conviction configurations for common roles:
* **The 10x Nomad Dev**: Dual 4K displays + Teak standing desk + Aero-mesh chair + Espresso bar + Rice terrace backdrop.
* **The Minimalist Creator**: 34" Curved ultrawide + Scandinavian white desk + Brass lamp + Linen bean bag.
* **The Island Founder**: 49" Super-ultrawide command center + Executive walnut desk + Leather chair + Sunset glow + Surfboard.

### 4. Transparent Nomad Pricing Engine
* **Weekly vs. Monthly Billing**: Instant pricing toggle with progressive monthly discount badges (*Save 25% on monthly rentals*).
* **Multi-Currency Support**: Switch between **USD ($)** and **IDR (Rp)** in one click.
* **Duration Stepper**: Customize rental length from 1 week up to 6 months.

### 5. High-Conversion "Ready to Rent" Checkout
* **Itemized Gear Manifest**: Full breakdown of selected furniture, peripherals, and lifestyle additions.
* **Bali Delivery Areas**: Preset logistics coverage for *Canggu (Batu Bolong & Echo Beach)*, *Pererenan*, *Seminyak*, *Ubud*, *Uluwatu*, and *Sanur*.
* **WhatsApp Direct Ordering**: Generates a pre-formatted, detailed rental manifest ready to send to Monis.rent's concierge on WhatsApp (the primary communication channel in Bali).
* **Confetti Celebration Feedback**: Visual delight upon reservation confirmation.

---

## 🛠️ Tech Stack & Decisions

| Technology | Role | Why It Was Chosen |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | Framework | Next-generation React 19 performance, Partial Prerendering (PPR), Turbopack, and seamless Vercel integration. |
| **Tailwind CSS v4** | Styling | Dynamic utility tokens, sleek modern dark aesthetics, responsive layout without bloated CSS bundles. |
| **Zustand** | State Management | Featherlight, reactive state decoupling the living canvas, catalog drawer, and pricing engine. |
| **Lucide React** | Icons | Clean, modern iconography across categories, presets, and action buttons. |
| **Canvas Confetti** | Micro-interaction | Celebratory feedback when finalizing rental reservations. |

---

## 🔮 What I Would Improve With More Time

1. **3D WebGL / Spline Integration**:
   - Upgrade the 2.5D layered vector canvas to an interactive 3D WebGL room viewer where users can orbit 360°, inspect wood grains up close, and adjust standing desk height with an interactive slider.
2. **Augmented Reality (AR) Villa Placement**:
   - Integrate Quick Look (USDZ) and WebXR so nomads can view their selected desk and chair placed directly inside their actual Bali villa room via their phone camera.
3. **Automated Wise / Stripe Deposit Authorizations**:
   - Connect direct card pre-authorizations for the refundable security deposit, providing instant automated delivery scheduling.
4. **Co-Living & Villa Community Sharing**:
   - Enable nomads to generate a public link (`?setup=10x-dev-xyz`) to split equipment rental costs with villa roommates or co-working peers.

---

## 🏃 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/agam-r/DreamDesk.git
cd DreamDesk

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# 4. Production build check
npm run build
```

---

## 🤝 Submitting to Desent
* **Collaborator**: `desent-bot` has been granted Read access under repo settings.
* Built with ❤️ for **Monis.rent** and **Desent**.
