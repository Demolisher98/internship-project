# Walkthrough: Union Packages B2B Voice Order App

We have transformed the test project into a complete, mobile-first, voice-first operational system for **Union Packages**, a B2B distributor in Vijayawada.

---

## 🛠️ Changes Implemented

### 1. Tab-View Restructuring ([index.html](file:///c:/Users/Shankar%20Ganesh/Desktop/internship-project/index.html))
Restructured the layout into a **3-Tab Navigation Web App** with a sticky bottom navigation menu:
1. **Stalls Tab (Deliveries & Active Orders)**: 
   - Dashboard metrics, search filter, active vendor due cards, and the floating voice record `+` button.
   - Includes a sticky **Low Stock Alert Banner** that dynamically alerts the merchant when items run low.
2. **Stock Tab (Inventory & Pricing Manager)**:
   - Dedicated dashboard table listing all items with editable fields for Name, BP, SP, Current Stock, and Max Stock.
3. **Directory Tab (Vendors Manager)**:
   - A list of all vendors in the system. Includes an **Add Vendor** field at the top to register new clients.

### 2. Premium Styling Upgrades ([style.css](file:///c:/Users/Shankar%20Ganesh/Desktop/internship-project/src/style.css))
- Implemented a modern dark glassmorphic design system using CSS backdrop filters, subtle borders, and glow effects.
- Added bottom tab-bar menu layouts and active state glows.
- Created stock status indicators:
  - **Red Pill** (`low`): Stock is `< 10%` of max limit (Critical).
  - **Yellow Pill** (`medium`): Stock is `< 40%` of max limit (Moderate warning).
  - **Green Pill** (`high`): Stock is `>= 40%` (In Stock).
- Added red glowing alert dot notifications on the Tab navigation menu.
- Handled mobile responsiveness (centered view frame for desktop screens, and edge-to-edge layouts for mobile viewports).

### 3. Application State, Stock Tracking & Directory Logic ([main.js](file:///c:/Users/Shankar%20Ganesh/Desktop/internship-project/src/main.js))
- **Dynamic Tab Switcher**: Binds navigation triggers to toggle view panels smoothly.
- **Dynamic Stock Level Tracking**: 
  - Every time an order is confirmed, the app **automatically deducts the quantity** from that item's available stock.
  - Automatically raises red/yellow warning labels on the stock page.
  - Triggers a global red banner alert on the front page and a red warning dot on the menu bar if any item drops below the 10% threshold.
- **Inline Auto-Saving Inventory**: Product catalog adjustments (names, BP, SP, stocks, and limits) auto-save immediately to `localStorage` as you type—no "save" button click required!
- **Dynamic Vendors Directory**:
  - Lets you search all clients, register new ones (using the top inline form), and delete old ones (with safety warnings in case of unpaid dues).
  - New directory additions automatically sync with the Voice NLP search indices, the Gemini LLM parsing system, and the confirmation select lists.
- **Float-Up Sorting**: When a card is updated (new order placed or cash collection saved), its `lastUpdated` timestamp is set to `Date.now()`, instantly bubbling the active card to the top of the feed for easy management.
- **Collection Workflow**:
  - Night collections panel on cards with quick pay buttons (`Full Payment`, `₹100`, `₹500`, `₹1000`) to subtract cash and update records.

---

## 📲 How to Run and Test

1. **Launch the app**:
   - The Vite development server is running in your browser at `https://localhost:5174/`.
   
2. **Access from a phone**:
   - Scan the terminal QR code or load the Network address on your phone.
   - Since speech recognition requires secure HTTPS, proceed past the browser self-signed SSL warning.

3. **Check the Stock alerts**:
   - Open the app. You will immediately see a yellow warning banner at the top of the **Stalls** page, and a red dot on the **Stock** tab. This is because default items like *Paper Cups* (5/100 stock) and *Juice Glasses* (8/100 stock) are pre-loaded at low thresholds for demonstration.
   - Switch to the **Stock** tab to view the red **Low (<10%)** stock pills.

4. **Verify Stock Deductions**:
   - Switch back to the **Stalls** tab. Click `+` and speak: *"Araku Biryani ordered 5 buffey plates"* or *"Star Hyderabad key 2 spoons pettu"*.
   - Tap **Stop & Process** -> **Save to Vendor Due**.
   - Go to the **Stock** tab. You will see that the stock for *Buffey Plates* has dropped from 75 to 70 automatically!

5. **Test Card Bubble-Up (Float to Top)**:
   - Add an order or save a collection cash payment on any vendor (e.g. *Rayalaseema Biryani*).
   - The card will immediately bubble to the very top of the screen with a time badge showing *"Updated [Time]"*.

6. **Add New Vendors or Delete Clients**:
   - Open the **Directory** tab.
   - Enter *"Vijayawada Eat Point"* and click **Add Vendor**.
   - It will appear in your directory. Switch to **Stalls** tab and click `+` -> you will see *"Vijayawada Eat Point"* is now available in the order dropdown.
   
7. **Gemini LLM Mixed Voice Testing**:
   - Tap the Settings gear ⚙️ in the top-right. Paste your Gemini API key and save.
   - Try complex mixed language speech: *"Rajahmundry Rose Milk key five juice glasses and tissues bundle pettu"*. The LLM will parse it into structured JSON orders.
