import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Default static lists (used for first-time setup initialization)
const VENDORS_STATIC = [
  "Star Hyderabad",
  "Thindhamra Mama",
  "Araku Biryani",
  "Ramanamma Biryani",
  "Painadu Biryani",
  "Pitapuram Biryani",
  "Amaravati Biryani",
  "Rayalaseema Biryani",
  "Mogalthuru Biryani",
  "Palakollu Biryani",
  "Kurnool Biryani",
  "Honey Biryani",
  "Anu Fruity",
  "Tirumala Biryani",
  "Divya Biryani",
  "Rajahmundry Rose Milk",
  "Apsara Badam Palu",
  "Srinidhi Parota",
  "Nitya Biryani",
  "Fun Falooda",
  "Quality Falooda",
  "Cream Falooda",
  "Rainbow Falooda",
  "London Bites",
  "Srikrishna Fruity",
  "Lakshmi Royala Biryani",
  "HKGN (Pizza)",
  "HashTag Falooda",
  "Sri Durga FF",
  "Madina Biryani"
];

const INVENTORY_STATIC_DEFAULTS = [
  { id: "buffey_plates", name: "Buffey Plates", sp: 360, bp: 309.6, stock: 50, maxStock: 100, unit: "pack" },
  { id: "1000ml_boxes", name: "1000ml boxes", sp: 400, bp: 370, stock: 50, maxStock: 100, unit: "pack" },
  { id: "750ml_boxes", name: "750ml boxes", sp: 370, bp: 340, stock: 50, maxStock: 100, unit: "pack" },
  { id: "13_16_thank_you", name: "13*16 thank you", sp: 160, bp: 140, stock: 50, maxStock: 100, unit: "pack" },
  { id: "13_16_china", name: "13*16 china", sp: 150, bp: 110, stock: 50, maxStock: 100, unit: "pack" },
  { id: "13_16_white", name: "13*16 white", sp: 150, bp: 110, stock: 50, maxStock: 100, unit: "pack" },
  { id: "10_12_thank_you", name: "10*12 thank you", sp: 160, bp: 140, stock: 50, maxStock: 100, unit: "pack" },
  { id: "10_12_china", name: "10*12 china", sp: 150, bp: 110, stock: 50, maxStock: 100, unit: "pack" },
  { id: "5_6", name: "5*6", sp: 50, bp: 37.5, stock: 50, maxStock: 100, unit: "pack" },
  { id: "sample_box", name: "sample box", sp: 40, bp: 30, stock: 50, maxStock: 100, unit: "pack" },
  { id: "tissues", name: "tissues", sp: 20, bp: 16, stock: 50, maxStock: 100, unit: "pack" },
  { id: "silver_plates", name: "silver plates", sp: 55, bp: 38, stock: 50, maxStock: 100, unit: "pack" },
  { id: "500ml_boxes", name: "500ml boxes", sp: 260, bp: 220, stock: 50, maxStock: 100, unit: "pack" },
  { id: "250ml_boxes", name: "250ml boxes", sp: 200, bp: 180, stock: 50, maxStock: 100, unit: "pack" },
  { id: "7_9", name: "7*9", sp: 70, bp: 50, stock: 50, maxStock: 100, unit: "pack" },
  { id: "6_8", name: "6*8", sp: 60, bp: 40, stock: 50, maxStock: 100, unit: "pack" },
  { id: "straws", name: "straws", sp: 30, bp: 20, stock: 50, maxStock: 100, unit: "pack" },
  { id: "350ml_glasses", name: "350ml glasses", sp: 100, bp: 90, stock: 50, maxStock: 100, unit: "pack" },
  { id: "300ml_glasses", name: "300ml glasses", sp: 80, bp: 70, stock: 50, maxStock: 100, unit: "pack" },
  { id: "350_lid", name: "350 lid", sp: 60, bp: 50, stock: 50, maxStock: 100, unit: "pack" },
  { id: "250ml_glass", name: "250ml glass", sp: 80, bp: 70, stock: 50, maxStock: 100, unit: "pack" },
  { id: "300_lid", name: "300 lid", sp: 50, bp: 40, stock: 50, maxStock: 100, unit: "pack" },
  { id: "spoon", name: "spoon", sp: 30, bp: 22, stock: 50, maxStock: 100, unit: "pack" },
  { id: "fork", name: "fork", sp: 30, bp: 22, stock: 50, maxStock: 100, unit: "pack" },
  { id: "toothpick", name: "toothpick", sp: 120, bp: 100, stock: 50, maxStock: 100, unit: "pack" },
  { id: "wooden_spoon", name: "wooden spoon", sp: 70, bp: 60, stock: 50, maxStock: 100, unit: "pack" },
  { id: "hand_glovess", name: "hand glovess", sp: 30, bp: 23, stock: 50, maxStock: 100, unit: "pack" },
  { id: "small_bowl", name: "small bowl", sp: 40, bp: 30, stock: 50, maxStock: 100, unit: "pack" },
  { id: "big_bowl", name: "big bowl", sp: 50, bp: 40, stock: 50, maxStock: 100, unit: "pack" },
  { id: "thermo_plate_9", name: "thermo plate 9", sp: 46, bp: 36, stock: 50, maxStock: 100, unit: "pack" },
  { id: "thermo_plate_7", name: "thermo plate 7", sp: 70, bp: 56, stock: 50, maxStock: 100, unit: "pack" },
  { id: "multi_10", name: "multi 10", sp: 25, bp: 18, stock: 50, maxStock: 100, unit: "pack" },
  { id: "board_10", name: "board 10", sp: 13, bp: 8, stock: 50, maxStock: 100, unit: "pack" },
  { id: "wrap", name: "wrap", sp: 350, bp: 300, stock: 50, maxStock: 100, unit: "pack" },
  { id: "silver_foil", name: "silver foil", sp: 390, bp: 350, stock: 50, maxStock: 100, unit: "pack" },
  { id: "dustbin_cover_10", name: "dustbin cover 10", sp: 950, bp: 850, stock: 50, maxStock: 100, unit: "pack" },
  { id: "dustbin_cover_1k", name: "dustbin cover 1k", sp: 150, bp: 110, stock: 50, maxStock: 100, unit: "pack" },
  { id: "tape_1inch", name: "tape 1inch", sp: 200, bp: 170, stock: 50, maxStock: 100, unit: "pack" },
  { id: "tape_2inch", name: "tape 2inch", sp: 450, bp: 400, stock: 50, maxStock: 100, unit: "pack" }
];

const firebaseConfig = {
  apiKey: "AIzaSyA7gSYrJftRnyjACnGw884zJgOsQf5H0ms",
  authDomain: "aeonian-packages.firebaseapp.com",
  projectId: "aeonian-packages",
  storageBucket: "aeonian-packages.firebasestorage.app",
  messagingSenderId: "787992726132",
  appId: "1:787992726132:web:1086590864d9bb661c5f21",
  measurementId: "G-MCBYNZ77QV"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const CLOUD_LIVE_DOC = "live";
const CLOUD_ARCHIVE_COLLECTION = "archives";

// ----------------------
// ANALYTICS EVENT LOGGER
// ----------------------
// Every key action writes a timestamped document to the "events" Firestore collection.
// This generates the independent-usage evidence the panel requested:
// panel can see exact timestamps of when Sai Pavan used the app without the team present.
async function logEvent(eventName, metadata = {}) {
  try {
    const isMerchant = appState.merchantMode === true;
    await addDoc(collection(db, "events"), {
      event: eventName,
      timestamp: serverTimestamp(),
      localTime: new Date().toISOString(),
      dev: !isMerchant,
      ...(isMerchant ? { merchant: "sai_pavan" } : { tester: "dev" }),
      ...metadata
    });
    console.log(`📊 Event logged: ${eventName} [${isMerchant ? '🟢 Merchant' : '🔵 Dev'}]`, metadata);
  } catch (err) {
    // Never block the user flow for analytics failures
    console.warn("Analytics log failed (non-critical):", err.message);
  }
}

// Get today's date as string (YYYY-MM-DD)
function getTodayDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

// Check if day has changed — archive yesterday's data and clear today's orders (dues persist)
async function checkAndArchiveDayChange(cloudData) {
  const today = getTodayDate();

  // Retrieve the last reset date, looking at cloudData first, then fallback to savedAt, then localStorage
  let lastResetDate = null;
  if (cloudData) {
    if (cloudData.lastResetDate) {
      lastResetDate = cloudData.lastResetDate;
    } else if (cloudData.savedAt) {
      lastResetDate = cloudData.savedAt.substring(0, 10);
    }
  }

  if (!lastResetDate) {
    lastResetDate = localStorage.getItem("aeonian_last_reset_date");
  }

  if (lastResetDate && lastResetDate !== today) {
    console.log(`📅 New day detected! Last reset: ${lastResetDate} → Today: ${today}`);
    // Archive previous day before clearing
    await archiveDayData(lastResetDate);
    // Clear orders for all vendors — dues carry forward
    appState.vendors.forEach(vendor => {
      vendor.orders = [];
      vendor.lastUpdated = 0; // reset bubble-up so all cards are equal at start of day
    });
    console.log("✅ Daily reset complete — orders cleared, dues preserved.");
    // Persist the cleared state immediately so the next load sees clean data
    appState.lastResetDate = today;
    await saveStore();
    logEvent("daily_reset", { previousDate: lastResetDate, today });
  }

  localStorage.setItem("aeonian_last_reset_date", today);
  appState.lastResetDate = today;
}

// Archive previous day's data to Firestore archive collection
async function archiveDayData(dateStr) {
  try {
    const archivePayload = {
      dateStr,
      archivedAt: new Date().toISOString(),
      vendors: appState.vendors,
      inventory: appState.inventory,
      purchaseLogs: appState.purchaseLogs,
      archiveType: "daily"
    };

    const archiveRef = doc(db, CLOUD_ARCHIVE_COLLECTION, `day-${dateStr}`);
    await setDoc(archiveRef, archivePayload);
    console.log(`✅ Data from ${dateStr} archived successfully to Firestore!`);
  } catch (error) {
    console.error("❌ Daily archive failed:", error.message);
  }
}

// Archive selected month's data to Firestore archive collection
async function archiveMonthData(monthKey) {
  try {
    console.log(`📦 Archiving month ${monthKey} to Firestore archive collection...`);

    const monthVendors = appState.vendors.map(vendor => ({
      name: vendor.name,
      due: vendor.due,
      lastUpdated: vendor.lastUpdated,
      orders: (vendor.orders || []).filter(entry => getRecordMonth(entry) === monthKey),
      history: (vendor.history || []).filter(entry => getRecordMonth(entry) === monthKey)
    }));

    const monthLogs = (appState.purchaseLogs || []).filter(log => getRecordMonth(log) === monthKey);

    const archivePayload = {
      monthKey,
      archivedAt: new Date().toISOString(),
      vendors: monthVendors,
      inventory: appState.inventory,
      purchaseLogs: monthLogs,
      archiveType: "monthly"
    };

    const archiveRef = doc(db, CLOUD_ARCHIVE_COLLECTION, monthKey);
    await setDoc(archiveRef, archivePayload);
    console.log(`✅ Month ${monthKey} archived successfully to Firestore!`);
  } catch (error) {
    console.error("❌ Monthly archive failed:", error.message);
  }
}

// Firestore Fetch
async function fetchFromCloud() {
  try {
    console.log("☁️  Fetching from Firestore live document...");
    const liveDocRef = doc(db, "app", CLOUD_LIVE_DOC);
    const snapshot = await getDoc(liveDocRef);
    if (!snapshot.exists()) {
      console.log("⚠️ No live cloud document found yet.");
      return null;
    }
    const data = snapshot.data();
    console.log("✅ Cloud data fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Cloud fetch failed:", error.message);
    return null;
  }
}

// Firestore Save
async function saveToCloud(data) {
  try {
    console.log("☁️  Saving to Firestore live document...", data);
    const liveDocRef = doc(db, "app", CLOUD_LIVE_DOC);
    await setDoc(liveDocRef, data);
    console.log("✅ Cloud save successful!");
    return { success: true };
  } catch (error) {
    console.error("❌ Cloud save failed:", error.message);
    return null;
  }
}

// App State Management
let appState = {
  vendors: [],
  inventory: [],
  purchaseLogs: [],
  apiKey: "",
  merchantMode: false, // false = Dev Mode (events tagged dev:true), true = Merchant Mode (events tagged merchant:"sai_pavan")
  merchantSnapshot: null,
  lastResetDate: null
};

// Initial state setup (CLOUD VERSION)
async function initStore() {
  console.log("🔄 Initializing app store from cloud...");

  const cloudData = await fetchFromCloud();

  if (cloudData && cloudData.vendors) {
    console.log("📦 Loading from cloud");
    appState.apiKey = cloudData.credentials?.geminiKey || "";
    appState.merchantMode = cloudData.credentials?.merchantMode === true;
    appState.purchaseLogs = cloudData.purchaseLogs || [];
    appState.lastResetDate = cloudData.lastResetDate || null;

    if (cloudData.inventory && cloudData.inventory.length > 0) {
      appState.inventory = cloudData.inventory;
    } else {
      appState.inventory = JSON.parse(JSON.stringify(INVENTORY_STATIC_DEFAULTS));
    }

    if (cloudData.vendors && cloudData.vendors.length > 0) {
      appState.vendors = cloudData.vendors;
      appState.vendors.forEach(v => {
        if (v.lastUpdated === undefined) v.lastUpdated = 0;
        if (!v.orders) v.orders = [];
        if (!v.history) v.history = [];
      });
    }

    // Load and initialize merchant snapshot (AFTER vendors, inventory, and purchaseLogs are loaded)
    appState.merchantSnapshot = cloudData.merchantSnapshot || null;
    if (appState.merchantMode && !appState.merchantSnapshot) {
      appState.merchantSnapshot = {
        vendors: JSON.parse(JSON.stringify(appState.vendors)),
        inventory: JSON.parse(JSON.stringify(appState.inventory)),
        purchaseLogs: JSON.parse(JSON.stringify(appState.purchaseLogs))
      };
    }

    // Run daily reset check AFTER loading cloud data so orders can be cleared
    await checkAndArchiveDayChange(cloudData);
  } else {
    console.log("📄 Cloud data empty, using defaults");
    appState.inventory = JSON.parse(JSON.stringify(INVENTORY_STATIC_DEFAULTS));
    appState.vendors = VENDORS_STATIC.map(name => ({
      name: name,
      due: 0,
      orders: [],
      history: [],
      lastUpdated: 0
    }));
    appState.purchaseLogs = [];
    appState.lastResetDate = getTodayDate();
    await saveStore();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("union_packages_theme", isDark ? "dark" : "light");
      themeToggleBtn.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    });
  }
}

async function saveStore() {
  // If we are in merchant mode, update the snapshot to the current state before saving
  if (appState.merchantMode) {
    appState.merchantSnapshot = {
      vendors: JSON.parse(JSON.stringify(appState.vendors)),
      inventory: JSON.parse(JSON.stringify(appState.inventory)),
      purchaseLogs: JSON.parse(JSON.stringify(appState.purchaseLogs))
    };
    try {
      localStorage.setItem("aeonian_merchant_snapshot", JSON.stringify(appState.merchantSnapshot));
    } catch (err) {
      console.error("Failed to save snapshot to localStorage:", err);
    }
  }

  const dataToSave = {
    vendors: appState.vendors,
    inventory: appState.inventory,
    purchaseLogs: appState.purchaseLogs,
    credentials: {
      geminiKey: appState.apiKey,
      merchantMode: appState.merchantMode
    },
    merchantSnapshot: appState.merchantSnapshot || null,
    lastResetDate: appState.lastResetDate || getTodayDate(),
    savedAt: new Date().toISOString()
  };
  console.log("💾 Saving to cloud:", dataToSave);
  return await saveToCloud(dataToSave);
}

// DOM elements hooks
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const vendorsContainer = document.getElementById("vendors-list-container");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");

const statSales = document.getElementById("stat-sales");
const statCollected = document.getElementById("stat-collected");
const statDue = document.getElementById("stat-due");
const statProfit = document.getElementById("stat-profit");

const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const apiKeyInput = document.getElementById("api-key-input");
const apiStatusText = document.getElementById("api-status-text");
const apiSaveFeedback = document.getElementById("api-save-feedback");
const apiStatusDot = document.querySelector(".api-status-badge .status-dot");
const defaultResetBtn = document.getElementById("default-reset-btn");
const monthlyResetBtn = document.getElementById("monthly-reset-btn");

const voiceTriggerBtn = document.getElementById("voice-trigger-btn");
const cameraTriggerBtn = document.getElementById("camera-trigger-btn");
const cameraFileInput = document.getElementById("camera-file-input");
const voiceOverlay = document.getElementById("voice-overlay");
const voiceStatusText = document.getElementById("voice-status-text");
const voiceTranscriptPreview = document.getElementById("voice-transcript-preview");
const voiceCancelBtn = document.getElementById("voice-cancel-btn");
const voiceStopBtn = document.getElementById("voice-stop-btn");

const confirmModal = document.getElementById("confirm-modal");
const closeConfirmBtn = document.getElementById("close-confirm-btn");
const cancelConfirmBtn = document.getElementById("cancel-confirm-btn");
const saveConfirmBtn = document.getElementById("save-confirm-btn");
const confirmRawTranscript = document.getElementById("confirm-raw-transcript");
const parserBadge = document.getElementById("parser-badge");
const confirmVendorSelect = document.getElementById("confirm-vendor-select");
const confirmNewVendorInput = document.getElementById("confirm-new-vendor-input");
const isNewVendorCb = document.getElementById("is-new-vendor-cb");
const confirmItemsList = document.getElementById("confirm-items-list");
const addItemRowBtn = document.getElementById("add-item-row-btn");
const confirmTodaysBill = document.getElementById("confirm-todays-bill");
const confirmPreviousDue = document.getElementById("confirm-previous-due");
const confirmTotalBp = document.getElementById("confirm-total-bp");
const confirmTotalSp = document.getElementById("confirm-total-sp");

const vendorLogModal = document.getElementById("vendor-log-modal");
const closeVendorLogBtn = document.getElementById("close-vendor-log-btn");
const vendorLogTitle = document.getElementById("vendor-log-title");
const vendorLogSubtitle = document.getElementById("vendor-log-subtitle");
const vendorLogList = document.getElementById("vendor-log-list");
const vendorLogDateFilter = document.getElementById("vendor-log-date-filter");
const clearVendorLogDateBtn = document.getElementById("clear-vendor-log-date-btn");
let activeVendorLogIndex = null;
let selectedStockLogMonth = getMonthKey(new Date());

// Navigation Tabs
const tabButtons = document.querySelectorAll(".app-tab-bar .tab-btn");
const tabViews = document.querySelectorAll(".tab-view");
const tabStockAlertDot = document.getElementById("tab-stock-alert-dot");
const stockAlertsBanner = document.getElementById("stock-alerts-banner");
const stockAlertsMsg = document.getElementById("stock-alerts-msg");

// Stock Tab
const tabInventoryList = document.getElementById("tab-inventory-list");
const tabAddProductBtn = document.getElementById("tab-add-product-btn");
const stockDebitLogList = document.getElementById("stock-debit-log-list");
const stockLogMonthSelect = document.getElementById("stock-log-month-select");
const stockLogDateFilter = document.getElementById("stock-log-date-filter");
const clearStockLogDateBtn = document.getElementById("clear-stock-log-date-btn");
const stockProductSpendingList = document.getElementById("stock-product-spending-list");

// Directory Tab
const directoryListContainer = document.getElementById("directory-list-container");
const directoryNewVendorName = document.getElementById("directory-new-vendor-name");
const directoryAddVendorBtn = document.getElementById("directory-add-vendor-btn");
const directorySearchInput = document.getElementById("directory-search-input");

// Analytics Tab
const analyticsTotalSales = document.getElementById("analytics-total-sales");
const analyticsTotalProfit = document.getElementById("analytics-total-profit");
const analyticsTotalCollected = document.getElementById("analytics-total-collected");
const analyticsTotalDue = document.getElementById("analytics-total-due");
const analyticsProfitMargin = document.getElementById("analytics-profit-margin");
const analyticsCollectionRate = document.getElementById("analytics-collection-rate");
const analyticsActiveVendors = document.getElementById("analytics-active-vendors");
const analyticsBestProduct = document.getElementById("analytics-best-product");
const analyticsProfitChart = document.getElementById("analytics-profit-chart");
const analyticsSalesMix = document.getElementById("analytics-sales-mix");
const analyticsVendorDues = document.getElementById("analytics-vendor-dues");
const analyticsLowStockCount = document.getElementById("analytics-low-stock-count");
const analyticsInventoryRisk = document.getElementById("analytics-inventory-risk");
const analyticsMonthSelect = document.getElementById("analytics-month-select");
let selectedAnalyticsMonth = getMonthKey(new Date());

// Audio Recording Init (MediaRecorder → Gemini Audio STT)
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let recordingStream = null;
let pulseInterval = null;

function startPulse() {
  let dots = 0;
  pulseInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    voiceStatusText.textContent = "Listening" + ".".repeat(dots);
  }, 500);
}

function stopPulse() {
  if (pulseInterval) {
    clearInterval(pulseInterval);
    pulseInterval = null;
  }
}

async function startAudioRecording() {
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 16000
      }
    });

    audioChunks = [];
    mediaRecorder = new MediaRecorder(recordingStream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstart = () => {
      isRecording = true;
      voiceTranscriptPreview.textContent = "";
      voiceTranscriptPreview.classList.add("placeholder-text");
      startPulse();
      if (navigator.vibrate) navigator.vibrate(40);
    };

    mediaRecorder.onstop = async () => {
      isRecording = false;
      stopPulse();
      recordingStream.getTracks().forEach(t => t.stop());

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      voiceTranscriptPreview.classList.remove("placeholder-text");
      voiceTranscriptPreview.textContent = "Processing audio...";
      voiceStatusText.textContent = "Sending to Gemini...";

      await processAudioBlob(audioBlob);
    };

    mediaRecorder.start(200);
  } catch (err) {
    console.error("Microphone access failed:", err);
    voiceStatusText.textContent = "Mic access denied. Check browser permissions.";
  }
}

function stopAudioRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

function abortAudioRecording() {
  stopPulse();
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.onstop = null;
    mediaRecorder.stop();
  }
  if (recordingStream) {
    recordingStream.getTracks().forEach(t => t.stop());
  }
  isRecording = false;
  audioChunks = [];
}

async function processAudioBlob(audioBlob) {
  if (!appState.apiKey) {
    voiceOverlay.classList.add("hidden");
    openOrderConfirmation({ vendorName: "", items: [], isNewVendor: true, source: "local" }, "No API key — manual entry");
    return;
  }

  try {
    const base64Audio = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const parsedResult = await runGeminiAudioParser(base64Audio, "audio/webm");
    voiceOverlay.classList.add("hidden");
    openOrderConfirmation(parsedResult, parsedResult._transcript || "");
  } catch (err) {
    console.error("Audio processing failed:", err);

    // Notify the user on the overlay that fallback is happening
    voiceStatusText.textContent = "API busy/error. Opening manual entry...";
    voiceTranscriptPreview.textContent = err.message;

    // Wait for 1 second (1000ms) before transitioning to the manual entry panel
    setTimeout(() => {
      voiceOverlay.classList.add("hidden");
      openOrderConfirmation(
        { vendorName: "", items: [], isNewVendor: true, source: "manual" },
        "Voice API Unavailable — Manual Override"
      );
    }, 1000);
  }
}

// ----------------------
// TAB NAVIGATION LOGIC
// ----------------------
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    // Switch Active button styling
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Toggle View Panels
    tabViews.forEach(view => {
      if (view.id === target) {
        view.classList.remove("hidden");
      } else {
        view.classList.add("hidden");
      }
    });

    // Refresh view content
    if (target === "view-stock") {
      renderStockTabList();
      renderStockDebitLogs();
    } else if (target === "view-analytics") {
      renderAnalytics();
    } else if (target === "view-directory") {
      renderDirectoryList();
    } else if (target === "view-stalls") {
      renderAll();
    }
  });
});

// ----------------------
// STOCK & ALERTS SERVICE
// ----------------------

function checkStockAlerts() {
  let lowCount = 0;

  appState.inventory.forEach(item => {
    const max = item.maxStock || 100;
    const stock = item.stock || 0;
    const ratio = stock / max;

    if (ratio < 0.10) {
      lowCount++;
    }
  });

  if (lowCount > 0) {
    tabStockAlertDot.classList.remove("hidden");
    stockAlertsBanner.classList.remove("hidden");
    stockAlertsMsg.textContent = `${lowCount} product(s) are running critically low on stock (< 10%)!`;
  } else {
    tabStockAlertDot.classList.add("hidden");
    stockAlertsBanner.classList.add("hidden");
  }
}

// ----------------------
// RENDER METHODS
// ----------------------

function updateDashboardMetrics() {
  let totalDue = 0;
  let totalCollected = 0;
  let totalSales = 0;
  let totalCost = 0;

  appState.vendors.forEach(vendor => {
    totalDue += vendor.due;

    vendor.history.forEach(payment => {
      totalCollected += payment.amount;
    });

    vendor.orders.forEach(order => {
      totalSales += order.sp * order.quantity;
      totalCost += order.bp * order.quantity;
    });
  });

  const totalProfit = totalSales - totalCost;

  statDue.textContent = formatCurrency(totalDue);
  statCollected.textContent = formatCurrency(totalCollected);
  statSales.textContent = formatCurrency(totalSales);
  statProfit.textContent = formatCurrency(totalProfit);
}

function formatCurrency(value) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function formatPercent(value) {
  return `${Math.round((value || 0) * 10) / 10}%`;
}

function getMonthKey(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(date.getTime())) return getMonthKey(new Date());
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
}

function getRecordMonth(record) {
  return record.monthKey || getMonthKey(record.timestamp || record.createdAt || new Date());
}

function getRecordDate(record, vendor) {
  const fallback = vendor?.lastUpdated ? new Date(vendor.lastUpdated) : new Date();
  const date = new Date(record.timestamp || record.createdAt || fallback);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function getDateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function normalizeName(value) {
  return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function levenshteinDistance(a, b) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left) return right.length;
  if (!right) return left.length;

  const dp = Array.from({ length: left.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= right.length; j++) dp[0][j] = j;

  for (let i = 1; i <= left.length; i++) {
    for (let j = 1; j <= right.length; j++) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[left.length][right.length];
}

function findNearestVendorName(spokenName) {
  if (appState.vendors.length === 0) return "";
  const normalizedSpoken = normalizeName(spokenName);
  if (!normalizedSpoken) return appState.vendors[0].name;

  const exact = appState.vendors.find(v => normalizeName(v.name) === normalizedSpoken);
  if (exact) return exact.name;

  const ranked = appState.vendors
    .map(vendor => ({
      name: vendor.name,
      score: levenshteinDistance(normalizedSpoken, vendor.name)
    }))
    .sort((a, b) => a.score - b.score);

  return ranked[0]?.name || appState.vendors[0].name;
}

function getAnalyticsMonths() {
  const months = new Set([getMonthKey(new Date())]);
  appState.vendors.forEach(vendor => {
    (vendor.orders || []).forEach(order => months.add(getRecordMonth(order)));
    (vendor.history || []).forEach(payment => months.add(getRecordMonth(payment)));
  });
  return [...months].sort().reverse();
}

function syncAnalyticsMonthSelect() {
  const months = getAnalyticsMonths();
  if (!months.includes(selectedAnalyticsMonth)) {
    selectedAnalyticsMonth = months[0] || getMonthKey(new Date());
  }

  analyticsMonthSelect.innerHTML = "";
  months.forEach(monthKey => {
    const option = document.createElement("option");
    option.value = monthKey;
    option.textContent = formatMonthLabel(monthKey);
    analyticsMonthSelect.appendChild(option);
  });
  analyticsMonthSelect.value = selectedAnalyticsMonth;
}

function getBusinessAnalytics(monthKey = selectedAnalyticsMonth) {
  const productMap = new Map();
  let totalDue = 0;
  let totalCollected = 0;
  let totalSales = 0;
  let totalCost = 0;
  let activeVendorCount = 0;

  appState.vendors.forEach(vendor => {
    const vendorDue = vendor.due || 0;
    totalDue += vendorDue;
    if (vendorDue > 0) activeVendorCount++;

    (vendor.history || [])
      .filter(payment => getRecordMonth(payment) === monthKey)
      .forEach(payment => {
      totalCollected += payment.amount || 0;
    });

    (vendor.orders || [])
      .filter(order => getRecordMonth(order) === monthKey)
      .forEach(order => {
      const quantity = order.quantity || 0;
      const sales = (order.sp || 0) * quantity;
      const cost = (order.bp || 0) * quantity;
      const existing = productMap.get(order.itemName) || {
        name: order.itemName,
        quantity: 0,
        sales: 0,
        cost: 0,
        profit: 0
      };

      existing.quantity += quantity;
      existing.sales += sales;
      existing.cost += cost;
      existing.profit += sales - cost;
      productMap.set(order.itemName, existing);

      totalSales += sales;
      totalCost += cost;
    });
  });

  const products = [...productMap.values()].sort((a, b) => b.profit - a.profit);
  const vendorsByDue = appState.vendors
    .filter(vendor => (vendor.due || 0) > 0)
    .map(vendor => ({ name: vendor.name, due: vendor.due || 0 }))
    .sort((a, b) => b.due - a.due);
  const inventoryRisk = appState.inventory
    .map(item => {
      const maxStock = item.maxStock || 100;
      const stock = item.stock || 0;
      return {
        name: item.name,
        stock,
        maxStock,
        ratio: maxStock > 0 ? stock / maxStock : 0
      };
    })
    .sort((a, b) => a.ratio - b.ratio);

  return {
    totalDue,
    totalCollected,
    totalSales,
    totalCost,
    totalProfit: totalSales - totalCost,
    profitMargin: totalSales > 0 ? ((totalSales - totalCost) / totalSales) * 100 : 0,
    collectionRate: totalSales > 0 ? (totalCollected / totalSales) * 100 : 0,
    activeVendorCount,
    products,
    vendorsByDue,
    inventoryRisk,
    lowStockCount: inventoryRisk.filter(item => item.ratio < 0.10).length,
    monthKey
  };
}

function renderEmptyAnalytics(container, message) {
  container.innerHTML = "";
  const empty = document.createElement("div");
  empty.className = "empty-state analytics-empty";
  empty.textContent = message;
  container.appendChild(empty);
}

function renderAnalyticsBarList(container, rows, valueKey, totalValue, valueFormatter) {
  container.innerHTML = "";
  if (rows.length === 0) {
    renderEmptyAnalytics(container, "No order data yet. Add a voice/manual order to see analytics.");
    return;
  }

  rows.forEach(row => {
    const rawValue = row[valueKey] || 0;
    const share = totalValue > 0 ? (rawValue / totalValue) * 100 : 0;
    const item = document.createElement("div");
    item.className = "analytics-bar-row";

    const meta = document.createElement("div");
    meta.className = "analytics-bar-meta";

    const name = document.createElement("span");
    name.textContent = row.name;
    const value = document.createElement("strong");
    value.textContent = `${valueFormatter(rawValue)} • ${formatPercent(share)}`;
    meta.append(name, value);

    const track = document.createElement("div");
    track.className = "analytics-bar-track";
    const fill = document.createElement("span");
    fill.style.width = `${share > 0 ? Math.max(4, share) : 0}%`;
    track.appendChild(fill);

    const sub = document.createElement("div");
    sub.className = "analytics-bar-sub";
    sub.textContent = `${row.quantity} units sold • ${formatCurrency(row.sales)} sales`;

    item.append(meta, track, sub);
    container.appendChild(item);
  });
}

function renderAnalyticsRankedList(container, rows, options = {}) {
  container.innerHTML = "";
  if (rows.length === 0) {
    renderEmptyAnalytics(container, options.emptyText || "Nothing needs attention right now.");
    return;
  }

  rows.slice(0, options.limit || 5).forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "ranked-list-row";

    const left = document.createElement("div");
    left.className = "ranked-list-main";
    const rank = document.createElement("span");
    rank.className = "rank-badge";
    rank.textContent = index + 1;
    const name = document.createElement("span");
    name.textContent = row.name;
    left.append(rank, name);

    const value = document.createElement("strong");
    value.textContent = options.valueFormatter(row);

    item.append(left, value);
    container.appendChild(item);
  });
}

function resetAppToDefaults() {
  const preservedApiKey = appState.apiKey;
  appState.vendors = VENDORS_STATIC.map(name => ({
    name,
    due: 0,
    orders: [],
    history: [],
    lastUpdated: 0
  }));
  appState.inventory = JSON.parse(JSON.stringify(INVENTORY_STATIC_DEFAULTS));
  appState.purchaseLogs = [];
  appState.apiKey = preservedApiKey;
  selectedAnalyticsMonth = getMonthKey(new Date());
  saveStore().catch(console.error);
  renderStockTabList();
  renderDirectoryList();
  renderAll();
}

async function resetSelectedMonthAnalytics() {
  const monthKey = selectedAnalyticsMonth || getMonthKey(new Date());
  await archiveMonthData(monthKey);

  appState.vendors.forEach(vendor => {
    vendor.orders = (vendor.orders || []).filter(order => getRecordMonth(order) !== monthKey);
    vendor.history = (vendor.history || []).filter(payment => getRecordMonth(payment) !== monthKey);
    if ((vendor.orders || []).length === 0 && (vendor.history || []).length === 0) {
      vendor.lastUpdated = vendor.due > 0 ? vendor.lastUpdated : 0;
    }
  });
  appState.purchaseLogs = (appState.purchaseLogs || []).filter(log => getRecordMonth(log) !== monthKey);
  await saveStore();
  await renderAll();
}

function renderAnalytics() {
  syncAnalyticsMonthSelect();
  const analytics = getBusinessAnalytics();

  analyticsTotalSales.textContent = formatCurrency(analytics.totalSales);
  analyticsTotalProfit.textContent = formatCurrency(analytics.totalProfit);
  analyticsTotalCollected.textContent = formatCurrency(analytics.totalCollected);
  analyticsTotalDue.textContent = formatCurrency(analytics.totalDue);
  analyticsProfitMargin.textContent = `${formatPercent(analytics.profitMargin)} margin`;
  analyticsCollectionRate.textContent = `${formatPercent(analytics.collectionRate)} collected`;
  analyticsActiveVendors.textContent = `${analytics.activeVendorCount} vendors pending`;
  analyticsLowStockCount.textContent = `${analytics.lowStockCount} low`;

  const topProfitProduct = analytics.products[0];
  analyticsBestProduct.textContent = topProfitProduct ? `Best: ${topProfitProduct.name}` : "No sales yet";

  const positiveProfitRows = analytics.products.filter(item => item.profit > 0);
  const totalPositiveProfit = positiveProfitRows.reduce((sum, item) => sum + item.profit, 0);
  renderAnalyticsBarList(analyticsProfitChart, positiveProfitRows, "profit", totalPositiveProfit, formatCurrency);

  const salesMixRows = [...analytics.products].sort((a, b) => b.sales - a.sales);
  const totalSalesMix = salesMixRows.reduce((sum, item) => sum + item.sales, 0);
  renderAnalyticsBarList(analyticsSalesMix, salesMixRows, "sales", totalSalesMix, formatCurrency);

  renderAnalyticsRankedList(analyticsVendorDues, analytics.vendorsByDue, {
    emptyText: "No pending dues. Collections are clear.",
    valueFormatter: row => formatCurrency(row.due)
  });

  renderAnalyticsRankedList(analyticsInventoryRisk, analytics.inventoryRisk, {
    limit: 6,
    valueFormatter: row => `${row.stock}/${row.maxStock}`
  });
}

function renderVendorLogs(vendorIdx) {
  const vendor = appState.vendors[vendorIdx];
  if (!vendor) return;
  activeVendorLogIndex = vendorIdx;
  const selectedDate = vendorLogDateFilter.value;

  const logs = [];
  (vendor.orders || []).forEach(order => {
    const date = getRecordDate(order, vendor);
    const total = (order.sp || 0) * (order.quantity || 0);
    logs.push({
      type: "Order",
      date,
      amount: total,
      description: `${order.itemName} x${order.quantity}`,
      meta: `SP ${formatCurrency(order.sp || 0)} each`
    });
  });

  (vendor.history || []).forEach((payment, pIdx) => {
    const date = getRecordDate(payment, vendor);
    logs.push({
      type: "Collection",
      date,
      amount: payment.amount || 0,
      description: "Cash collected",
      meta: "Payment received",
      index: pIdx
    });
  });

  const visibleLogs = logs
    .filter(log => !selectedDate || getDateInputValue(log.date) === selectedDate)
    .sort((a, b) => b.date - a.date);
  vendorLogTitle.textContent = `${vendor.name} Logs`;
  vendorLogSubtitle.textContent = `${visibleLogs.length} entries • Current due ${formatCurrency(vendor.due || 0)}`;
  vendorLogList.innerHTML = "";

  if (visibleLogs.length === 0) {
    renderEmptyAnalytics(vendorLogList, selectedDate ? "No vendor activity found for the selected date." : "No orders or collections recorded for this vendor yet.");
    vendorLogModal.classList.remove("hidden");
    return;
  }

  const groupedByMonth = new Map();
  visibleLogs.forEach(log => {
    const monthKey = getMonthKey(log.date);
    const dayKey = log.date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short"
    });

    if (!groupedByMonth.has(monthKey)) groupedByMonth.set(monthKey, new Map());
    const dayMap = groupedByMonth.get(monthKey);
    if (!dayMap.has(dayKey)) dayMap.set(dayKey, []);
    dayMap.get(dayKey).push(log);
  });

  groupedByMonth.forEach((dayMap, monthKey) => {
    const monthBlock = document.createElement("section");
    monthBlock.className = "vendor-log-month";

    const monthTitle = document.createElement("h4");
    monthTitle.textContent = formatMonthLabel(monthKey);
    monthBlock.appendChild(monthTitle);

    dayMap.forEach((dayLogs, dayLabel) => {
      const dayBlock = document.createElement("div");
      dayBlock.className = "vendor-log-day";

      const dayTitle = document.createElement("div");
      dayTitle.className = "vendor-log-day-title";
      dayTitle.textContent = dayLabel;
      dayBlock.appendChild(dayTitle);

      dayLogs.forEach(log => {
        const row = document.createElement("div");
        row.className = `vendor-log-row ${log.type.toLowerCase()}`;

        const left = document.createElement("div");
        const type = document.createElement("span");
        type.className = "vendor-log-type";
        type.textContent = log.type;
        const desc = document.createElement("strong");
        desc.textContent = log.description;
        const meta = document.createElement("small");
        meta.textContent = `${log.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • ${log.meta}`;
        left.append(type, desc, meta);

        const amount = document.createElement("span");
        amount.className = "vendor-log-amount";
        amount.textContent = `${log.type === "Collection" ? "-" : "+"}${formatCurrency(log.amount)}`;

        if (log.type === "Collection") {
          const undoBtn = document.createElement("button");
          undoBtn.className = "undo-payment-btn";
          undoBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Undo
          `;
          undoBtn.title = "Undo this payment";
          undoBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (!confirm(`Are you sure you want to undo this collection of ₹${log.amount}? This will add ₹${log.amount} back to the vendor's due.`)) {
              return;
            }

            // Revert vendor due
            vendor.due += log.amount;
            // Remove from vendor history
            vendor.history.splice(log.index, 1);
            // Save state
            await saveStore();
            logEvent("due_collection_undone", {
              vendorName: vendor.name,
              amount: log.amount,
              newDue: vendor.due
            });
            // Re-render
            renderAll();
            renderVendorLogs(vendorIdx);
          });

          const rightCol = document.createElement("div");
          rightCol.className = "log-right-actions";
          rightCol.append(amount, undoBtn);
          row.append(left, rightCol);
        } else {
          row.append(left, amount);
        }

        dayBlock.appendChild(row);
      });

      monthBlock.appendChild(dayBlock);
    });

    vendorLogList.appendChild(monthBlock);
  });

  vendorLogModal.classList.remove("hidden");
}

async function undoVendorCollection(vendorIdx, paymentIdx, askConfirmation = true) {
  const vendor = appState.vendors[vendorIdx];
  if (!vendor || !vendor.history || !vendor.history[paymentIdx]) return false;

  const payment = vendor.history[paymentIdx];
  const amount = payment.amount || 0;

  if (askConfirmation && !confirm(`Undo this collection of ${formatCurrency(amount)}? This will add it back to ${vendor.name}'s due.`)) {
    return false;
  }

  vendor.due += amount;
  vendor.history.splice(paymentIdx, 1);
  vendor.lastUpdated = Date.now();

  await saveStore();
  logEvent("due_collection_undone", {
    vendorName: vendor.name,
    amount,
    newDue: vendor.due
  });
  renderAll();
  return true;
}

function renderVendorsList(filterQuery = "") {
  vendorsContainer.innerHTML = "";
  const query = filterQuery.toLowerCase().trim();

  const filtered = appState.vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    vendorsContainer.innerHTML = `<div class="empty-state">No vendors found matching "${filterQuery}"</div>`;
    return;
  }

  // Float updated cards
  const sorted = [...filtered].sort((a, b) => {
    const aTime = a.lastUpdated || 0;
    const bTime = b.lastUpdated || 0;
    if (bTime !== aTime) {
      return bTime - aTime;
    }
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((vendor) => {
    const originalIndex = appState.vendors.findIndex(v => v.name === vendor.name);
    const card = document.createElement("div");
    card.className = "vendor-card";

    let ordersMarkup = "";
    if (vendor.orders && vendor.orders.length > 0) {
      ordersMarkup = `
        <div class="vendor-orders-list">
          ${vendor.orders.map((order, orderIdx) => `
            <div class="order-item-row">
              <div class="item-name-qty">
                <span class="item-name">${order.itemName}</span>
                <span class="item-qty">x${order.quantity}</span>
              </div>
              <div class="item-prices-sub">
                <span class="item-unit-price">@ ₹${order.sp}</span>
                <span class="item-total-price">₹${order.sp * order.quantity}</span>
                <button class="remove-order-item-btn" data-vendor="${originalIndex}" data-order="${orderIdx}" title="Remove returned item">✕</button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    let historyLabel = "";
    const totalCollected = vendor.history.reduce((sum, p) => sum + p.amount, 0);
    const lastCollectionIndex = vendor.history.length - 1;
    if (totalCollected > 0) {
      historyLabel = `<span class="collection-history-tag">Total Paid: ₹${totalCollected}</span>`;
    }

    if (totalCollected > 0) {
      historyLabel = `
        <span class="collection-history-tag">Total Paid: ${formatCurrency(totalCollected)}</span>
        <button class="undo-last-collection-btn" data-index="${originalIndex}" data-payment-index="${lastCollectionIndex}" title="Undo latest collection">Undo last</button>
      `;
    }

    card.innerHTML = `
      <div class="vendor-card-header">
        <div>
          <h2 class="vendor-title">${vendor.name}</h2>
          <div class="vendor-date">${vendor.lastUpdated > 0 ? `Updated ${new Date(vendor.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'No recent activity'}</div>
        </div>
        <div class="vendor-card-actions">
          <button class="add-order-btn" data-index="${originalIndex}" title="Add Order Manually">+ Order</button>
          <button class="delete-vendor-btn" data-index="${originalIndex}" title="Reset Dues & Orders">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      ${ordersMarkup}

      <div class="vendor-financial-summary">
        <div class="financial-label-group">
          <span class="financial-label">Due Amount</span>
          <span class="due-amount-display ${vendor.due === 0 ? 'paid' : ''}">₹${vendor.due}</span>
        </div>
        <span class="status-badge ${vendor.due === 0 ? 'paid' : 'pending'}">
          ${vendor.due === 0 ? 'Paid' : 'Pending'}
        </span>
      </div>

      <div class="collection-panel">
        <div class="collection-header">
          <span>Night Collection (10:30-11:00 PM)</span>
          ${historyLabel}
        </div>
        <div class="collection-input-row">
          <div class="collection-input-wrapper">
            <span class="rupee-symbol">₹</span>
            <input type="number"
                   id="collect-input-${originalIndex}"
                   class="collection-input"
                   placeholder="Enter cash amount"
                   min="0"
                   max="${vendor.due}" />
          </div>
          <button class="collect-btn" data-index="${originalIndex}">Collect</button>
        </div>
        <div class="quick-pay-chips">
          <button class="chip-btn quick-pay-chip" data-index="${originalIndex}" data-value="${vendor.due}">Clear Full</button>
          <button class="chip-btn quick-pay-chip" data-index="${originalIndex}" data-value="100">₹100</button>
          <button class="chip-btn quick-pay-chip" data-index="${originalIndex}" data-value="500">₹500</button>
          <button class="chip-btn quick-pay-chip" data-index="${originalIndex}" data-value="1000">₹1000</button>
        </div>
      </div>
      <div class="add-due-panel">
        <div class="add-due-header">＋ Add Due (Carry-forward / Notebook Sync)</div>
        <div class="add-due-row">
          <div class="collection-input-wrapper">
            <span class="rupee-symbol">₹</span>
            <input type="number" id="add-due-input-${originalIndex}" class="collection-input add-due-input" placeholder="Enter amount" min="0" data-index="${originalIndex}" />
          </div>
          <button class="add-due-confirm-btn" data-index="${originalIndex}">Add</button>
        </div>
      </div>
      <button class="vendor-log-link" data-index="${originalIndex}">View month/day logs</button>
      <button class="send-bill-btn" data-index="${originalIndex}">📲 Send Bill</button>
    `;

    vendorsContainer.appendChild(card);
  });

  // Manual order entry per vendor card
  document.querySelectorAll(".add-order-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute("data-index"));
      const vendor = appState.vendors[idx];
      openOrderConfirmation(
        { vendorName: vendor.name, items: [], isNewVendor: false, source: "manual" },
        "Manual Entry"
      );
    });
  });

  // Attach card delete action
  document.querySelectorAll(".delete-vendor-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(btn.getAttribute("data-index"));
      if (confirm(`Are you sure you want to reset orders and dues for ${appState.vendors[idx].name}?`)) {
        appState.vendors[idx].due = 0;
        appState.vendors[idx].orders = [];
        appState.vendors[idx].history = [];
        appState.vendors[idx].lastUpdated = 0;
        saveStore().catch(console.error);
        renderAll();
      }
    });
  });

  // Attach cash collection submit
  document.querySelectorAll(".collect-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      const input = document.getElementById(`collect-input-${idx}`);
      const val = parseFloat(input.value);
      if (isNaN(val) || val <= 0) return;
      processCollection(idx, val);
    });
  });

  // Attach quick pay chips
  document.querySelectorAll(".quick-pay-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const idx = parseInt(chip.getAttribute("data-index"));
      const val = parseFloat(chip.getAttribute("data-value"));
      const due = appState.vendors[idx].due;

      const input = document.getElementById(`collect-input-${idx}`);
      input.value = Math.min(val, due);
    });
  });

  document.querySelectorAll(".undo-last-collection-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute("data-index"));
      const paymentIdx = parseInt(btn.getAttribute("data-payment-index"));
      await undoVendorCollection(idx, paymentIdx, true);
    });
  });

  document.querySelectorAll(".vendor-log-link").forEach(btn => {
    btn.addEventListener("click", () => {
      renderVendorLogs(parseInt(btn.getAttribute("data-index")));
    });
  });

  // Remove returned item from vendor order
  document.querySelectorAll(".remove-order-item-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const vendorIdx = parseInt(btn.getAttribute("data-vendor"));
      const orderIdx = parseInt(btn.getAttribute("data-order"));
      const vendor = appState.vendors[vendorIdx];
      const removed = vendor.orders[orderIdx];
      if (!confirm(`Remove "${removed.itemName} x${removed.quantity}" from ${vendor.name}'s order?`)) return;
      const invItem = appState.inventory.find(i => i.name === removed.itemName);
      if (invItem) invItem.stock += removed.quantity;
      vendor.due = Math.max(0, vendor.due - (removed.sp * removed.quantity));
      vendor.orders.splice(orderIdx, 1);
      vendor.lastUpdated = Date.now();
      saveStore().catch(console.error);
      renderVendorsList(searchInput.value);
      updateDashboardMetrics();
    });
  });

  // Add Due: directly seed a vendor's outstanding due
  document.querySelectorAll(".add-due-confirm-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute("data-index"));
      const input = document.getElementById(`add-due-input-${idx}`);
      const val = parseFloat(input.value);
      if (isNaN(val) || val <= 0) { input.focus(); return; }
      processAddDue(idx, val);
      input.value = "";
    });
  });

  // Add Due: allow pressing Enter in input
  document.querySelectorAll(".add-due-input").forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const idx = parseInt(input.getAttribute("data-index"));
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) return;
        processAddDue(idx, val);
        input.value = "";
      }
    });
  });

  // Send WhatsApp bill
  document.querySelectorAll(".send-bill-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const vendorIdx = parseInt(btn.getAttribute("data-index"));
      logEvent("bill_sent", {
        vendorName: appState.vendors[vendorIdx]?.name || "unknown",
        due: appState.vendors[vendorIdx]?.due || 0
      });
      generateAndShareBill(vendorIdx);
    });
  });
}

// ----------------------
// WHATSAPP BILL GENERATOR
// ----------------------
async function generateAndShareBill(vendorIdx) {
  const vendor = appState.vendors[vendorIdx];

  if (!vendor.orders || vendor.orders.length === 0) {
    alert(`No orders for ${vendor.name} today.`);
    return;
  }

  // ── Layout constants ──────────────────────────────────────
  const W        = 640;
  const PAD      = 40;
  const HEADER_H = 160;  // logo + address + date
  const BILL_H   = 80;   // "DAILY BILL FOR" + vendor name
  const COL_H    = 36;   // column header row
  const ROW_H    = 56;   // each item row
  const DIV_H    = 20;   // thin divider gap
  const SUB_H    = 52;   // subtotal row
  const SUM_H    = 150;  // unified Financial Summary box (Today's Bill, Previous Due, Total Due)
  const FOOT_H   = 60;   // footer text

  const todaysBill = vendor.orders.filter(o => o.itemName !== "Previous Due").reduce((sum, o) => sum + (o.sp * o.quantity), 0);
  const previousDue = Math.max(0, vendor.due - todaysBill);
  const totalDue = vendor.due;

  const itemCount = vendor.orders.length;
  const H = HEADER_H + BILL_H + COL_H + itemCount * ROW_H + DIV_H + SUB_H + SUM_H + FOOT_H;

  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // ── Colours ───────────────────────────────────────────────
  const BG       = "#0d1f2d";   // deep navy
  const SURFACE  = "#162533";   // slightly lighter navy for rows
  const TEAL     = "#4ecdc4";   // accent teal (headings, icons, labels)
  const GOLD     = "#c9a84c";   // gold (vendor name, totals)
  const WHITE    = "#f0f4f8";
  const MUTED    = "#7a9bb5";
  const DIVIDER  = "#1e3448";

  // helpers
  function roundRect(x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // ── Full background ───────────────────────────────────────
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // ── HEADER ────────────────────────────────────────────────
  let y = 0;

  // Infinity logo (∞) top right
  ctx.fillStyle = GOLD;
  ctx.font = "bold 44px serif";
  ctx.textAlign = "right";
  ctx.fillText("∞", W - PAD, y + 56);
  ctx.textAlign = "left";

  // Brand name
  ctx.fillStyle = TEAL;
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("AEONIAN", PAD, y + 46);

  ctx.fillStyle = MUTED;
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.fillText("P A C K A G E S", PAD, y + 66);

  // Tagline + address
  ctx.fillStyle = MUTED;
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillText("B2B Disposable Solutions", PAD, y + 94);
  ctx.fillText("Eat Street, Vijayawada, India", PAD, y + 112);

  // Date top right
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  ctx.fillStyle = MUTED;
  ctx.font = "13px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(dateStr, W - PAD, y + 112);
  ctx.textAlign = "left";

  // Gold divider line
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y + 130);
  ctx.lineTo(W - PAD, y + 130);
  ctx.stroke();

  y += HEADER_H;

  // ── DAILY BILL FOR + vendor name ──────────────────────────
  ctx.fillStyle = TEAL;
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.fillText("DAILY BILL FOR", PAD, y + 22);

  ctx.fillStyle = GOLD;
  ctx.font = "bold 30px system-ui, sans-serif";
  ctx.fillText(vendor.name, PAD, y + 58);

  // Small gold underline
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, y + 66);
  ctx.lineTo(PAD + 40, y + 66);
  ctx.stroke();

  y += BILL_H;

  // ── COLUMN HEADERS ────────────────────────────────────────
  ctx.fillStyle = MUTED;
  ctx.font = "700 11px system-ui, sans-serif";
  ctx.fillText("ITEM", PAD + 36, y + 22);

  const QTY_X    = W * 0.60;
  const PRICE_X  = W * 0.73;
  const AMT_X    = W - PAD;

  ctx.textAlign = "center";
  ctx.fillText("QTY",     QTY_X,   y + 22);
  ctx.fillText("U/PRICE", PRICE_X, y + 22);
  ctx.textAlign = "right";
  ctx.fillText("AMOUNT",  AMT_X,   y + 22);
  ctx.textAlign = "left";

  y += COL_H;

  // ── ITEM ROWS ─────────────────────────────────────────────
  // product-type icons (unicode glyphs as simple stand-ins)
  const iconMap = {
    "plate":  "○", "box": "□", "tissue": "≋", "wrap": "◎",
    "glass":  "▭", "straw": "∥", "spoon": "⌣", "fork": "⌣",
    "bowl":   "◡", "cover": "◫", "foil": "▦", "tape": "⊓",
    "default":"◈"
  };

  function getIcon(name) {
    const n = name.toLowerCase();
    for (const [key, val] of Object.entries(iconMap)) {
      if (n.includes(key)) return val;
    }
    return iconMap.default;
  }

  vendor.orders.forEach((order, i) => {
    const rowY = y + i * ROW_H;

    // subtle row background
    roundRect(PAD - 8, rowY, W - (PAD - 8) * 2, ROW_H - 6, 6, SURFACE);

    // icon
    ctx.fillStyle = TEAL;
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(getIcon(order.itemName), PAD + 2, rowY + 26);

    // item name
    ctx.fillStyle = WHITE;
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(order.itemName, PAD + 36, rowY + 26);

    // qty
    ctx.fillStyle = WHITE;
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(order.quantity, QTY_X, rowY + 26);

    // unit price
    ctx.fillStyle = MUTED;
    ctx.font = "13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${order.sp}`, PRICE_X, rowY + 26);

    // line total
    const lineTotal = order.sp * order.quantity;
    ctx.fillStyle = WHITE;
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${lineTotal}`, AMT_X, rowY + 26);
    ctx.textAlign = "left";
  });

  y += itemCount * ROW_H + DIV_H;

  // ── SUBTOTAL ──────────────────────────────────────────────
  ctx.strokeStyle = DIVIDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(W - PAD, y);
  ctx.stroke();

  const productCount = vendor.orders.filter(o => o.itemName !== "Previous Due").length;
  ctx.fillStyle = MUTED;
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText(`Subtotal (${productCount} item${productCount !== 1 ? "s" : ""})`, PAD, y + 34);
  ctx.fillStyle = WHITE;
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`${todaysBill}`, AMT_X, y + 34);
  ctx.textAlign = "left";

  y += SUB_H;

  // ── FINANCIAL SUMMARY CARD ────────────────────────────────
  roundRect(PAD - 8, y, W - (PAD - 8) * 2, SUM_H - 10, 8, SURFACE);

  const cardY = y;

  // Row 1: Today's Bill
  ctx.fillStyle = TEAL;
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("TODAY'S BILL", PAD + 16, cardY + 32);

  ctx.fillStyle = WHITE;
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`₹${todaysBill}`, AMT_X - 16, cardY + 32);
  ctx.textAlign = "left";

  // Row 2: Previous Due
  ctx.fillStyle = MUTED;
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("PREVIOUS DUE", PAD + 16, cardY + 68);

  ctx.fillStyle = WHITE;
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`₹${previousDue}`, AMT_X - 16, cardY + 68);
  ctx.textAlign = "left";

  // Divider line
  ctx.strokeStyle = DIVIDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 16, cardY + 90);
  ctx.lineTo(W - PAD - 16, cardY + 90);
  ctx.stroke();

  // Row 3: Total Due
  ctx.fillStyle = TEAL;
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.fillText("TOTAL DUE", PAD + 16, cardY + 118);

  ctx.fillStyle = GOLD;
  ctx.font = "bold 26px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`₹${totalDue}`, AMT_X - 16, cardY + 118);
  ctx.textAlign = "left";

  y += SUM_H;

  // ── FOOTER ────────────────────────────────────────────────
  ctx.strokeStyle = DIVIDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y + 10);
  ctx.lineTo(W - PAD, y + 10);
  ctx.stroke();

  ctx.fillStyle = MUTED;
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Aeonian Packages – High-Quality Disposables", PAD, y + 32);
  ctx.fillText("for Eat Street, Vijayawada.", PAD, y + 50);

  // ── SHARE ─────────────────────────────────────────────────
  canvas.toBlob(async (blob) => {
    const file = new File([blob], `bill-${vendor.name}-${Date.now()}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Bill for ${vendor.name}` });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bill-${vendor.name}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, "image/png");
}

function processCollection(vendorIdx, amount) {
  const vendor = appState.vendors[vendorIdx];
  if (amount > vendor.due) {
    alert("Collected amount cannot be higher than the outstanding due!");
    return;
  }

  vendor.due -= amount;
  vendor.lastUpdated = Date.now();
  vendor.history.push({
    amount: amount,
    timestamp: new Date().toISOString(),
    monthKey: getMonthKey(new Date())
  });

  saveStore().catch(console.error);
  logEvent("due_collected", {
    vendorName: vendor.name,
    amount: amount,
    remainingDue: vendor.due
  });
  renderAll();

  if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
}

// ----------------------
// ADD DUE (notebook sync / carry-forward)
// ----------------------
function processAddDue(vendorIdx, amount) {
  const vendor = appState.vendors[vendorIdx];

  // Add pseudo-order "Previous Due" to item list
  const prevDueOrder = {
    itemName: "Previous Due",
    quantity: 1,
    sp: amount,
    bp: 0,
    timestamp: new Date().toISOString(),
    monthKey: getMonthKey(new Date())
  };

  vendor.orders = vendor.orders || [];
  vendor.orders.push(prevDueOrder);
  vendor.due += amount;
  vendor.lastUpdated = Date.now();

  saveStore().catch(console.error);
  logEvent("due_added_manual", {
    vendorName: vendor.name,
    amount,
    newDue: vendor.due
  });
  renderVendorsList(searchInput.value);
  updateDashboardMetrics();
  if (navigator.vibrate) navigator.vibrate(30);
}

// ----------------------
// TAB 2: INVENTORY & STOCK RENDERING
// ----------------------

function getStockStatusLabel(stock, max) {
  const ratio = stock / max;
  if (ratio < 0.10) {
    return `<span class="status-pill low">Low (<10%)</span>`;
  } else if (ratio < 0.40) {
    return `<span class="status-pill medium">Medium (<40%)</span>`;
  } else {
    return `<span class="status-pill high">High (Ok)</span>`;
  }
}

function renderStockTabList() {
  tabInventoryList.innerHTML = "";
  if (appState.inventory.length === 0) {
    tabInventoryList.innerHTML = `<div class="empty-state">No products registered. Tap below to add!</div>`;
    return;
  }

  appState.inventory.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "tab-inventory-row";

    const max = item.maxStock || 100;
    const stock = item.stock || 0;
    const statusLabel = getStockStatusLabel(stock, max);

    row.innerHTML = `
      <div>
        <input type="text" class="stock-item-name" value="${item.name}" placeholder="Product Name" data-index="${index}" />
        <div class="stock-status-wrapper">${statusLabel}</div>
      </div>
      <div class="price-inputs-col">
        <input type="number" class="stock-item-bp" value="${item.bp}" placeholder="BP Price" min="0" data-index="${index}" title="Buying Price" />
        <input type="number" class="stock-item-sp" value="${item.sp}" placeholder="SP Price" min="0" data-index="${index}" title="Selling Price" />
      </div>
      <div class="stock-inputs-col">
        <input type="number" class="stock-item-stock" value="${stock}" placeholder="Stock" min="0" max="${max}" data-index="${index}" title="Current Stock" />
        <input type="number" class="stock-item-max" value="${max}" placeholder="Max Limit" min="1" data-index="${index}" title="Max Capacity" />
      </div>
      <div class="stock-actions-col">
        <button class="buy-item-row-btn" data-index="${index}" title="Buy stock">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
        <button class="delete-item-row-btn" data-index="${index}" title="Delete product">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;

    // Attach inline listeners to dynamically update the state on typing/focus change
    const nameInput = row.querySelector(".stock-item-name");
    const bpInput = row.querySelector(".stock-item-bp");
    const spInput = row.querySelector(".stock-item-sp");
    const stockInput = row.querySelector(".stock-item-stock");
    const maxInput = row.querySelector(".stock-item-max");
    const statusWrapper = row.querySelector(".stock-status-wrapper");

    const updateItemState = () => {
      const idx = parseInt(nameInput.getAttribute("data-index"));
      const targetItem = appState.inventory[idx];
      if (!targetItem) return;

      targetItem.name = nameInput.value.trim() || "Product";
      targetItem.bp = parseFloat(bpInput.value) || 0;
      targetItem.sp = parseFloat(spInput.value) || 0;

      const newMax = parseInt(maxInput.value) || 100;
      const newStock = parseInt(stockInput.value) || 0;

      targetItem.maxStock = newMax;
      targetItem.stock = Math.min(newStock, newMax);

      // Update status pill dynamically inline
      statusWrapper.innerHTML = getStockStatusLabel(targetItem.stock, targetItem.maxStock);

      saveStore().catch(console.error);
      checkStockAlerts();
    };

    // Listeners for inline auto saving
    nameInput.addEventListener("input", updateItemState);
    bpInput.addEventListener("input", updateItemState);
    spInput.addEventListener("input", updateItemState);
    stockInput.addEventListener("input", updateItemState);
    maxInput.addEventListener("input", updateItemState);

    tabInventoryList.appendChild(row);
  });

  // Attach buy listeners
  tabInventoryList.querySelectorAll(".buy-item-row-btn").forEach(btn => {
    btn.addEventListener("click", () => openBuyModal(parseInt(btn.getAttribute("data-index"))));
  });

  // Attach delete listeners
  tabInventoryList.querySelectorAll(".delete-item-row-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      if (confirm(`Remove product "${appState.inventory[idx].name}" from catalog?`)) {
        appState.inventory.splice(idx, 1);
        saveStore().catch(console.error);
        renderStockTabList();
        checkStockAlerts();
      }
    });
  });
}

function getStockLogMonths() {
  const months = new Set([getMonthKey(new Date())]);
  (appState.purchaseLogs || []).forEach(log => months.add(getRecordMonth(log)));
  return [...months].sort().reverse();
}

function syncStockLogMonthSelect() {
  const months = getStockLogMonths();
  if (!months.includes(selectedStockLogMonth)) {
    selectedStockLogMonth = months[0] || getMonthKey(new Date());
  }

  stockLogMonthSelect.innerHTML = "";
  months.forEach(monthKey => {
    const option = document.createElement("option");
    option.value = monthKey;
    option.textContent = formatMonthLabel(monthKey);
    stockLogMonthSelect.appendChild(option);
  });
  stockLogMonthSelect.value = selectedStockLogMonth;
}

// ----------------------
// BUY MODAL — proper UI replacing prompt()
// ----------------------

// Inject buy modal into DOM once
(function injectBuyModal() {
  const modal = document.createElement("div");
  modal.id = "buy-modal";
  modal.className = "modal-overlay hidden";
  modal.innerHTML = `
    <div class="modal-card buy-modal-card">
      <div class="modal-header">
        <h3>Buy Stock</h3>
        <button id="close-buy-modal-btn" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="buy-modal-item-name" id="buy-modal-item-name">—</div>
        <div class="buy-modal-current-bp" id="buy-modal-current-bp"></div>

        <div class="buy-modal-fields">
          <div class="buy-modal-field">
            <label>Quantity</label>
            <input type="number" id="buy-qty-input" min="1" value="1" placeholder="Qty" />
          </div>
          <div class="buy-modal-field">
            <label>Price per unit (₹)</label>
            <input type="number" id="buy-price-input" min="0" step="0.01" placeholder="BP" />
          </div>
        </div>

        <div class="buy-modal-total-row">
          <span>Total Cost</span>
          <strong id="buy-modal-total">₹0</strong>
        </div>

        <div id="buy-price-notice" class="buy-price-notice hidden"></div>
      </div>
      <div class="modal-footer">
        <button id="cancel-buy-modal-btn" class="secondary-btn">Cancel</button>
        <button id="confirm-buy-modal-btn" class="primary-btn">Confirm Purchase</button>
      </div>
    </div>
  `;
  document.getElementById("app").appendChild(modal);

  // Wire up close/cancel
  modal.querySelector("#close-buy-modal-btn").addEventListener("click", closeBuyModal);
  modal.querySelector("#cancel-buy-modal-btn").addEventListener("click", closeBuyModal);

  // Live total + price notice
  const qtyInput = modal.querySelector("#buy-qty-input");
  const priceInput = modal.querySelector("#buy-price-input");
  const totalEl = modal.querySelector("#buy-modal-total");
  const noticeEl = modal.querySelector("#buy-price-notice");

  function updateBuyModalCalc() {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    totalEl.textContent = `₹${(qty * price).toLocaleString("en-IN")}`;

    const itemIdx = parseInt(modal.getAttribute("data-item-idx"));
    const item = appState.inventory[itemIdx];
    if (!item) return;

    const currentBp = item.bp || 0;
    const currentStock = item.stock || 0;

    if (price > 0 && price !== currentBp) {
      if (currentStock > 0) {
        noticeEl.className = "buy-price-notice pending";
        noticeEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          New price ₹${price} will activate once current stock of <strong>${currentStock} units</strong> is sold out. Old stock continues at ₹${currentBp}.
        `;
      } else {
        noticeEl.className = "buy-price-notice immediate";
        noticeEl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Stock is at 0 — price will update to ₹${price} immediately.
        `;
      }
    } else {
      noticeEl.className = "buy-price-notice hidden";
      noticeEl.innerHTML = "";
    }
  }

  qtyInput.addEventListener("input", updateBuyModalCalc);
  priceInput.addEventListener("input", updateBuyModalCalc);

  modal.querySelector("#confirm-buy-modal-btn").addEventListener("click", () => {
    const itemIdx = parseInt(modal.getAttribute("data-item-idx"));
    const qty = parseInt(qtyInput.value);
    const price = parseFloat(priceInput.value);

    if (Number.isNaN(qty) || qty <= 0) {
      qtyInput.focus(); return;
    }
    if (Number.isNaN(price) || price < 0) {
      priceInput.focus(); return;
    }

    commitInventoryPurchase(itemIdx, qty, price);
    closeBuyModal();
  });
})();

function openBuyModal(itemIdx) {
  const item = appState.inventory[itemIdx];
  if (!item) return;
  const modal = document.getElementById("buy-modal");
  modal.setAttribute("data-item-idx", itemIdx);

  modal.querySelector("#buy-modal-item-name").textContent = item.name;
  modal.querySelector("#buy-modal-current-bp").textContent =
    `Current BP: ₹${item.bp || 0}  •  Stock: ${item.stock || 0} units`;
  modal.querySelector("#buy-qty-input").value = 1;
  modal.querySelector("#buy-price-input").value = item.bp || "";
  modal.querySelector("#buy-modal-total").textContent = `₹${item.bp || 0}`;
  modal.querySelector("#buy-price-notice").className = "buy-price-notice hidden";
  modal.querySelector("#buy-price-notice").innerHTML = "";

  modal.classList.remove("hidden");
  modal.querySelector("#buy-qty-input").focus();
}

function closeBuyModal() {
  document.getElementById("buy-modal").classList.add("hidden");
}

function commitInventoryPurchase(itemIdx, qty, enteredPrice) {
  const item = appState.inventory[itemIdx];
  if (!item) return;

  const currentStock = item.stock || 0;
  const currentBp = item.bp || 0;
  const timestamp = new Date().toISOString();

  // Price logic:
  // - If stock is 0 OR price matches current bp → update bp immediately
  // - If stock > 0 AND price differs → store as pendingBp (activates when stock hits 0)
  if (currentStock === 0 || enteredPrice === currentBp) {
    item.bp = enteredPrice;
    delete item.pendingBp;
  } else if (enteredPrice !== currentBp) {
    // Keep current bp for old stock, queue new price for when stock runs out
    item.pendingBp = enteredPrice;
  }

  item.stock = currentStock + qty;
  if ((item.maxStock || 0) < item.stock) item.maxStock = item.stock;

  appState.purchaseLogs.push({
    itemId: item.id,
    itemName: item.name,
    quantity: qty,
    bp: enteredPrice,
    previousBp: currentBp,
    priceChanged: enteredPrice !== currentBp,
    amount: qty * enteredPrice,
    timestamp,
    monthKey: getMonthKey(timestamp)
  });

  saveStore().catch(console.error);
  renderStockTabList();
  renderStockDebitLogs();
  checkStockAlerts();
}

// Call this whenever stock is deducted (after saving an order)
// to apply pendingBp if stock has now reached 0
function applyPendingBpIfStockDepleted() {
  let changed = false;
  appState.inventory.forEach(item => {
    if ((item.stock || 0) === 0 && item.pendingBp !== undefined) {
      item.bp = item.pendingBp;
      delete item.pendingBp;
      changed = true;
    }
  });
  if (changed) saveStore().catch(console.error);
}

function renderStockDebitLogs() {
  syncStockLogMonthSelect();
  const selectedDate = stockLogDateFilter ? stockLogDateFilter.value : "";

  // 1. Filter logs by date or by month select
  const logs = (appState.purchaseLogs || [])
    .map(log => ({ ...log, date: getRecordDate(log) }))
    .filter(log => {
      if (selectedDate) {
        return getDateInputValue(log.date) === selectedDate;
      }
      return getRecordMonth(log) === selectedStockLogMonth;
    })
    .sort((a, b) => b.date - a.date);

  // 2. Aggregate spending by product
  const spendingMap = new Map();
  logs.forEach(log => {
    const cost = log.amount || 0;
    const existing = spendingMap.get(log.itemName) || { name: log.itemName, spent: 0, qty: 0 };
    existing.spent += cost;
    existing.qty += log.quantity || 0;
    spendingMap.set(log.itemName, existing);
  });

  const productSpending = [...spendingMap.values()].sort((a, b) => b.spent - a.spent);

  // 3. Render Spending by Product breakdown
  if (stockProductSpendingList) {
    stockProductSpendingList.innerHTML = "";
    if (productSpending.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state compact";
      empty.textContent = "No product spending recorded for the selected period.";
      stockProductSpendingList.appendChild(empty);
    } else {
      productSpending.forEach((row, index) => {
        const item = document.createElement("div");
        item.className = "ranked-list-row";
        item.style.padding = "6px 0";

        const left = document.createElement("div");
        left.className = "ranked-list-main";
        const rank = document.createElement("span");
        rank.className = "rank-badge";
        rank.textContent = index + 1;
        const name = document.createElement("span");
        name.textContent = row.name;
        left.append(rank, name);

        const value = document.createElement("strong");
        value.textContent = `₹${row.spent}`;
        value.style.color = "var(--text-main)";

        item.append(left, value);
        stockProductSpendingList.appendChild(item);
      });
    }
  }

  // 4. Render daily debit log entries
  stockDebitLogList.innerHTML = "";
  if (logs.length === 0) {
    renderEmptyAnalytics(stockDebitLogList, selectedDate ? "No purchases recorded for the selected date." : "No purchases recorded for this month.");
    return;
  }

  const dayMap = new Map();
  logs.forEach(log => {
    const dayKey = log.date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short"
    });
    if (!dayMap.has(dayKey)) dayMap.set(dayKey, []);
    dayMap.get(dayKey).push(log);
  });

  const monthBlock = document.createElement("section");
  monthBlock.className = "vendor-log-month";
  const monthTitle = document.createElement("h4");
  monthTitle.textContent = selectedDate ? new Date(selectedDate).toLocaleDateString("en-IN", { month: "long", year: "numeric", day: "numeric" }) : formatMonthLabel(selectedStockLogMonth);
  monthBlock.appendChild(monthTitle);

  dayMap.forEach((dayLogs, dayLabel) => {
    const dayBlock = document.createElement("div");
    dayBlock.className = "vendor-log-day";
    const dayTitle = document.createElement("div");
    dayTitle.className = "vendor-log-day-title";
    dayTitle.textContent = dayLabel;
    dayBlock.appendChild(dayTitle);

    dayLogs.forEach(log => {
      const row = document.createElement("div");
      row.className = "vendor-log-row debit";
      const left = document.createElement("div");

      const type = document.createElement("span");
      type.className = "vendor-log-type";
      type.textContent = "Purchase";

      const desc = document.createElement("strong");
      desc.textContent = `${log.itemName}  ×${log.quantity}`;

      const meta = document.createElement("small");
      const priceInfo = log.priceChanged
        ? `₹${log.bp} each  •  <span class="price-changed-tag">price changed from ₹${log.previousBp}</span>`
        : `₹${log.bp} each`;
      meta.innerHTML = `${log.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}  •  ${priceInfo}`;

      left.append(type, desc, meta);

      const right = document.createElement("div");
      right.className = "log-right-col";

      const amount = document.createElement("span");
      amount.className = "vendor-log-amount";
      amount.textContent = `-${formatCurrency(log.amount || 0)}`;

      const unitLabel = document.createElement("small");
      unitLabel.className = "log-unit-label";
      unitLabel.textContent = `${log.quantity} × ₹${log.bp}`;

      right.append(amount, unitLabel);
      row.append(left, right);
      dayBlock.appendChild(row);
    });

    monthBlock.appendChild(dayBlock);
  });

  stockDebitLogList.appendChild(monthBlock);
}

tabAddProductBtn.addEventListener("click", () => {
  appState.inventory.push({
    id: "custom_" + Date.now(),
    name: "New Product",
    bp: 0,
    sp: 0,
    stock: 0,
    maxStock: 100,
    unit: "pack"
  });
  saveStore().catch(console.error);
  renderStockTabList();
  renderStockDebitLogs();

  // Multi-layered auto scroll to bottom
  const container = document.querySelector("#view-stock .settings-scroll-body");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
  if (tabInventoryList) {
    tabInventoryList.scrollTop = tabInventoryList.scrollHeight;

    const rows = tabInventoryList.querySelectorAll(".tab-inventory-row");
    const lastRow = rows[rows.length - 1];
    if (lastRow) {
      lastRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
});

// ----------------------
// TAB 3: DIRECTORY RENDERING
// ----------------------
function renderDirectoryList() {
  directoryListContainer.innerHTML = "";
  const query = directorySearchInput.value.toLowerCase().trim();

  const filtered = appState.vendors.filter(v =>
    v.name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    directoryListContainer.innerHTML = `<div class="empty-state">No vendors match "${directorySearchInput.value}"</div>`;
    return;
  }

  // Sort alphabetically for directory
  const sorted = [...filtered].sort((a,b) => a.name.localeCompare(b.name));

  sorted.forEach(vendor => {
    const originalIndex = appState.vendors.findIndex(v => v.name === vendor.name);
    const row = document.createElement("div");
    row.className = "directory-row";

    // Check if vendor has outstanding dues
    const hasDue = vendor.due > 0;
    const badge = hasDue ? `<span class="directory-vendor-badge">Due: ₹${vendor.due}</span>` : "";

    row.innerHTML = `
      <div class="directory-vendor-name">
        ${vendor.name}
        ${badge}
      </div>
      <button class="delete-vendor-btn delete-dir-vendor" data-index="${originalIndex}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;
    directoryListContainer.appendChild(row);
  });

  // Attach delete action
  directoryListContainer.querySelectorAll(".delete-dir-vendor").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      const vendor = appState.vendors[idx];

      if (vendor.due > 0) {
        if (!confirm(`Warning: ${vendor.name} has outstanding due of ₹${vendor.due}. Are you sure you want to delete this vendor entirely?`)) {
          return;
        }
      } else {
        if (!confirm(`Remove vendor "${vendor.name}" from your active records?`)) {
          return;
        }
      }

      appState.vendors.splice(idx, 1);
      saveStore().catch(console.error);
      renderDirectoryList();
    });
  });
}

// Add Vendor in Directory Tab
directoryAddVendorBtn.addEventListener("click", () => {
  const name = directoryNewVendorName.value.trim();
  if (!name) {
    alert("Please enter a valid vendor name.");
    return;
  }

  // Check duplicate
  const exists = appState.vendors.some(v => v.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert("A vendor with this name already exists!");
    return;
  }

  appState.vendors.unshift({
    name: name,
    due: 0,
    orders: [],
    history: [],
    lastUpdated: Date.now() // Bubble to top immediately
  });

  saveStore().catch(console.error);
  directoryNewVendorName.value = "";
  renderDirectoryList();

  if (navigator.vibrate) navigator.vibrate(30);
});

// Search Directory
directorySearchInput.addEventListener("input", renderDirectoryList);


// ----------------------
// PARSERS (GEMINI & FALLBACK)
// ----------------------

// Word-to-number mapping
const NUMBER_MAP = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'okati': 1, 'rendu': 2, 'moodu': 3, 'nalugu': 4, 'aidu': 5, 'aaru': 6, 'edu': 7, 'enimidi': 8, 'tommidi': 9, 'padi': 10,
  'oka': 1, 'rendu': 2, 'mood': 3, 'nalug': 4, 'aid': 5, 'aar': 6, 'ed': 7
};

function parseWordToNumber(word) {
  const w = word.toLowerCase().trim();
  if (!isNaN(parseInt(w))) {
    return parseInt(w);
  }
  return NUMBER_MAP[w] || null;
}

// Fallback pattern matching engine
function runLocalFallbackParser(transcript) {
  const text = transcript.toLowerCase();
  let matchedVendor = "";
  let matchedItems = [];

  // 1. Fuzzy match vendor name using a sliding window
  const transcriptWords = normalizeName(text).split(/\s+/);
  let bestMatch = { name: "", distance: Infinity, allowed: 0 };

  for (const v of appState.vendors) {
    const vName = normalizeName(v.name);
    if (!vName) continue;

    // Fast path: Exact substring match
    if (text.includes(vName)) {
      bestMatch = { name: v.name, distance: 0, allowed: 0 };
      break;
    }

    // Fuzzy path: Levenshtein distance on a sliding window
    const vendorWords = vName.split(/\s+/);
    const vLen = vendorWords.length;

    // Scale allowed typos dynamically: allow ~2 typos per word in the vendor's name
    const maxAllowedTypos = Math.max(2, vLen * 2);

    if (transcriptWords.length < vLen) {
      // If the transcript is shorter than the vendor name, compare directly
      const dist = levenshteinDistance(vName, transcriptWords.join(" "));
      if (dist < bestMatch.distance) {
        bestMatch = { name: v.name, distance: dist, allowed: maxAllowedTypos };
      }
    } else {
      // Slide a window matching the vendor's word count across the transcript
      for (let i = 0; i <= transcriptWords.length - vLen; i++) {
        const windowText = transcriptWords.slice(i, i + vLen).join(" ");
        const dist = levenshteinDistance(vName, windowText);

        if (dist < bestMatch.distance) {
          bestMatch = { name: v.name, distance: dist, allowed: maxAllowedTypos };
        }
      }
    }
  }

  // Assign the vendor if the best fuzzy match is within our acceptable typo threshold
  if (bestMatch.name && bestMatch.distance <= bestMatch.allowed) {
    matchedVendor = bestMatch.name;
  }

  // 2. Parse products and quantities
  const quantityRegexStr = "(\\d+|one|two|three|four|five|six|seven|eight|nine|ten|okati|oka|rendu|render|moodu|nalugu|aidu)";

  appState.inventory.forEach(item => {
    const lowerName = item.name.toLowerCase();
    let keywords = [lowerName];

    if (lowerName.endsWith("s")) {
      keywords.push(lowerName.slice(0, -1));
    }

    if (lowerName.includes("*")) {
      keywords.push(lowerName.replace("*", " "));
      keywords.push(lowerName.replace("*", "x"));
    }

    if (lowerName.includes("plate")) keywords.push("plates", "plate");
    if (lowerName.includes("box")) keywords.push("boxes", "box");
    if (lowerName.includes("spoon")) keywords.push("spoons", "spoon");
    if (lowerName.includes("glass")) keywords.push("glasses", "glass");
    if (lowerName.includes("lid")) keywords.push("lids", "lid");
    if (lowerName.includes("bowl")) keywords.push("bowls", "bowl");
    if (lowerName.includes("cover")) keywords.push("covers", "cover");
    if (lowerName.includes("glove")) keywords.push("gloves", "glove");
    if (lowerName.includes("foil")) keywords.push("foil");
    if (lowerName.includes("wrap")) keywords.push("wrap");
    if (lowerName.includes("straw")) keywords.push("straws", "straw");
    if (lowerName.includes("toothpick")) keywords.push("toothpicks", "toothpick");
    if (lowerName.includes("tissue")) keywords.push("tissues", "tissue");

    for (const keyword of keywords) {
      const forwardRegex = new RegExp(`${quantityRegexStr}\\s*(?:packets|packet|bundles|bundle|kg|pack|packs|of)?\\s*${keyword}`, "i");
      const backwardRegex = new RegExp(`${keyword}\\s*(?:packets|packet|bundles|bundle|kg|pack|packs|of)?\\s*${quantityRegexStr}`, "i");

      let match = text.match(forwardRegex);
      if (!match) {
        match = text.match(backwardRegex);
      }

      if (match) {
        const qtyVal = parseWordToNumber(match[1]);
        if (qtyVal) {
          if (!matchedItems.some(i => i.name === item.name)) {
            matchedItems.push({
              name: item.name,
              qty: qtyVal
            });
          }
          break;
        }
      }
    }
  });

  return {
    vendorName: matchedVendor,
    items: matchedItems,
    isNewVendor: matchedVendor === "",
    source: "local"
  };
}

// Call Google Gemini API with raw audio (STT + parsing in one shot)
// Three-model fallback chain — each model has a separate quota pool.
// If gemini-2.5-flash is saturated (common on free tier at 7-9 PM peak),
// we automatically retry with lite and 2.0-flash before giving up.
const GEMINI_MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash"
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(status) {
  return status === 429 || status === 503 || (status >= 500 && status < 600);
}

async function callGeminiModel(model, base64Audio, prompt, mimeType) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${appState.apiKey}`;
  const payload = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mimeType, data: base64Audio } },
        { text: prompt }
      ]
    }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    const err = new Error(`Gemini Error (${model}): ${response.status} - ${errorDetails}`);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  const jsonText = result.candidates[0].content.parts[0].text;
  return JSON.parse(jsonText.replace(/```json|```/g, "").trim());
}

async function runGeminiAudioParser(base64Audio, mimeType = "audio/webm", onStatus) {
  if (!appState.apiKey) {
    throw new Error("No API key configured");
  }

  const prompt = `You are an AI order processor for "Union Packages", a B2B disposable products distributor in Vijayawada, India.

Listen to this audio recording of a vendor placing an order. The speech may be in English, Telugu, or mixed Tanglish. There may be background noise — focus on the order content.

Available Vendors:
${JSON.stringify(appState.vendors.map(v => v.name))}

Available Products:
${JSON.stringify(appState.inventory.map(i => i.name))}

Instructions:
1. Transcribe the full audio first (store in "transcript" field).
2. Fuzzy-match the vendor name to the closest one in the Vendors List. Only set isNewVendor=true if they clearly say it's a new vendor.
3. Fuzzy-match each product mentioned to the Products list.
4. Convert Telugu numbers: okati/oka=1, rendu=2, moodu=3, nalugu=4, aidu=5, aaru=6, edu=7, enimidi=8, tommidi=9, padi=10.
5. Return ONLY a JSON object with these exact fields, no markdown:
{"transcript": "...", "vendorName": "...", "isNewVendor": false, "items": [{"name": "...", "qty": 1}]}`;

  let lastError = null;

  for (let mi = 0; mi < GEMINI_MODEL_CHAIN.length; mi++) {
    const model = GEMINI_MODEL_CHAIN[mi];
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const label = mi === 0
          ? "Sending to Gemini..."
          : `Trying backup model ${mi + 1} of ${GEMINI_MODEL_CHAIN.length}...`;
        if (onStatus) onStatus(label);
        if (voiceStatusText) voiceStatusText.textContent = label;

        const parsedData = await callGeminiModel(model, base64Audio, prompt, mimeType);
        console.log(`✅ Gemini success [model=${model}, attempt=${attempt}]`);
        return {
          vendorName: parsedData.vendorName || "",
          items: parsedData.items || [],
          isNewVendor: !!parsedData.isNewVendor,
          _transcript: parsedData.transcript || "",
          source: "gemini"
        };
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Gemini attempt failed [model=${model}, attempt=${attempt}]:`, err.message);

        if (!isRetryable(err.status)) break; // bad key, bad request — no point retrying

        if (attempt < maxAttempts) {
          const waitMs = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
          const msg = `Servers busy, retrying in ${waitMs / 1000}s...`;
          if (onStatus) onStatus(msg);
          if (voiceStatusText) voiceStatusText.textContent = msg;
          await sleep(waitMs);
        }
      }
    }
    // All retries on this model exhausted — move to next model
    console.warn(`⚠️ All attempts failed for ${model}, trying next model...`);
  }

  throw lastError || new Error("All Gemini models failed after retries.");
}

async function runGeminiImageParser(base64Image, mimeType = "image/jpeg", onStatus) {
  if (!appState.apiKey) {
    throw new Error("No API key configured");
  }

  const prompt = `You are an AI order processor for "Aeonian Packages", a B2B distributor of disposable food packaging products in Vijayawada, India.

Analyze this image/photo of a handwritten order note. The handwriting contains one or more product orders for a specific vendor (food stall). Focus on the vendor name and the products listed with their quantities.

Available Vendors:
${JSON.stringify(appState.vendors.map(v => v.name))}

Available Products:
${JSON.stringify(appState.inventory.map(i => i.name))}

Instructions:
1. Transcribe the handwritten order text or summarize what you see in the note (store in "transcript" field).
2. Fuzzy-match the vendor name to the closest one in the Vendors List. If no matches are found, set "vendorName" to the name written on the note and set isNewVendor=true.
3. Extract each product and its quantity. Fuzzy-match the product name to the closest one in the Products list. If the quantity is written in words (e.g. one, two, five, rendu, aidu), convert to a number.
4. Return ONLY a JSON object with these exact fields, no markdown backticks:
{"transcript": "...", "vendorName": "...", "isNewVendor": false, "items": [{"name": "...", "qty": 1}]}`;

  let lastError = null;

  for (let mi = 0; mi < GEMINI_MODEL_CHAIN.length; mi++) {
    const model = GEMINI_MODEL_CHAIN[mi];
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const label = mi === 0
          ? "Analyzing note with Gemini..."
          : `Trying backup model ${mi + 1} of ${GEMINI_MODEL_CHAIN.length}...`;
        if (onStatus) onStatus(label);
        if (voiceStatusText) voiceStatusText.textContent = label;

        const parsedData = await callGeminiModel(model, base64Image, prompt, mimeType);
        console.log(`✅ Gemini image success [model=${model}, attempt=${attempt}]`);
        return {
          vendorName: parsedData.vendorName || "",
          items: parsedData.items || [],
          isNewVendor: !!parsedData.isNewVendor,
          _transcript: parsedData.transcript || "",
          source: "gemini"
        };
      } catch (err) {
        lastError = err;
        console.warn(`⚠️ Gemini image attempt failed [model=${model}, attempt=${attempt}]:`, err.message);

        if (!isRetryable(err.status)) break; // bad key, bad request — no point retrying

        if (attempt < maxAttempts) {
          const waitMs = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
          const msg = `Servers busy, retrying in ${waitMs / 1000}s...`;
          if (onStatus) onStatus(msg);
          if (voiceStatusText) voiceStatusText.textContent = msg;
          await sleep(waitMs);
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models failed after retries.");
}

// ----------------------
// MODAL WORKFLOW ACTIONS
// ----------------------

function openOrderConfirmation(parsedData, rawTranscript) {
  confirmRawTranscript.textContent = `"${rawTranscript}"`;
  const badgeMap = {
    gemini: { label: "Gemini LLM", bg: "rgba(59, 130, 246, 0.15)", color: "var(--accent-blue)" },
    manual: { label: "Manual Entry", bg: "rgba(16, 185, 129, 0.15)", color: "var(--accent-green)" },
    local:  { label: "Local Fallback", bg: "rgba(245, 158, 11, 0.15)", color: "var(--accent-amber)" }
  };
  const badge = badgeMap[parsedData.source] || badgeMap.local;
  parserBadge.textContent = badge.label;
  parserBadge.style.background = badge.bg;
  parserBadge.style.color = badge.color;

  // Reset confirmation selectors using current dynamic vendors list
  confirmVendorSelect.innerHTML = "";
  appState.vendors.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = v.name;
    confirmVendorSelect.appendChild(opt);
  });

  isNewVendorCb.checked = false;
  confirmVendorSelect.classList.remove("hidden");
  confirmNewVendorInput.classList.add("hidden");
  confirmNewVendorInput.value = parsedData.vendorName || "";

  if (appState.vendors.length > 0) {
    confirmVendorSelect.value = findNearestVendorName(parsedData.vendorName);
  }

  // Populate items
  confirmItemsList.innerHTML = "";
  if (parsedData.items && parsedData.items.length > 0) {
    parsedData.items.forEach(item => {
      const matchedInv = appState.inventory.find(i => i.name.toLowerCase() === item.name.toLowerCase()) || appState.inventory[0];
      if (matchedInv) {
        addItemRow(matchedInv.name, item.qty);
      }
    });
  } else {
    if (appState.inventory.length > 0) {
      addItemRow(appState.inventory[0].name, 1);
    }
  }

  recalculateConfirmationTotals();
  confirmModal.classList.remove("hidden");
}

function addItemRow(selectedName = "", qty = 1, price = null) {
  const row = document.createElement("div");
  row.className = "confirm-item-row";

  const select = document.createElement("select");
  select.className = "confirm-item-select";
  appState.inventory.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.name;
    opt.textContent = item.name;
    select.appendChild(opt);
  });

  if (selectedName) {
    select.value = selectedName;
  }

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.className = "confirm-qty-input";
  qtyInput.min = "1";
  qtyInput.value = qty;
  qtyInput.title = "Quantity";

  const arrowContainer = document.createElement("div");
  arrowContainer.className = "confirm-qty-arrows";

  const upArrow = document.createElement("button");
  upArrow.type = "button";
  upArrow.className = "confirm-qty-arrow up";
  upArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  upArrow.title = "Increase Quantity";
  upArrow.addEventListener("click", () => {
    let currentVal = parseInt(qtyInput.value) || 0;
    qtyInput.value = currentVal + 1;
    qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
  });

  const downArrow = document.createElement("button");
  downArrow.type = "button";
  downArrow.className = "confirm-qty-arrow down";
  downArrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
  downArrow.title = "Decrease Quantity";
  downArrow.addEventListener("click", () => {
    let currentVal = parseInt(qtyInput.value) || 0;
    const minVal = parseInt(qtyInput.min) || 1;
    if (currentVal > minVal) {
      qtyInput.value = currentVal - 1;
      qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  arrowContainer.appendChild(upArrow);
  arrowContainer.appendChild(downArrow);

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.className = "confirm-price-input";
  priceInput.min = "0";
  priceInput.title = "Custom Selling Price";

  const matchedInv = appState.inventory.find(i => i.name === select.value);
  priceInput.value = price !== null ? price : (matchedInv ? matchedInv.sp : 0);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-item-row-btn";
  removeBtn.innerHTML = "&times;";
  removeBtn.addEventListener("click", () => {
    row.remove();
    recalculateConfirmationTotals();
  });

  select.addEventListener("change", () => {
    const item = appState.inventory.find(i => i.name === select.value);
    if (item) {
      priceInput.value = item.sp;
    }
    recalculateConfirmationTotals();
  });

  qtyInput.addEventListener("input", recalculateConfirmationTotals);
  priceInput.addEventListener("input", recalculateConfirmationTotals);

  row.appendChild(select);
  row.appendChild(priceInput);
  row.appendChild(qtyInput);
  row.appendChild(arrowContainer);
  row.appendChild(removeBtn);
  confirmItemsList.appendChild(row);
}

function recalculateConfirmationTotals() {
  let totalBp = 0;
  let todaysBill = 0;

  const rows = confirmItemsList.querySelectorAll(".confirm-item-row");
  rows.forEach(row => {
    const select = row.querySelector(".confirm-item-select");
    const qtyInput = row.querySelector(".confirm-qty-input");
    const priceInput = row.querySelector(".confirm-price-input");

    const itemName = select.value;
    const qty = parseInt(qtyInput.value) || 0;
    const customSp = parseFloat(priceInput.value) || 0;

    const matchedInv = appState.inventory.find(i => i.name === itemName);
    if (matchedInv) {
      totalBp += matchedInv.bp * qty;
      todaysBill += customSp * qty;
    }
  });

  const previousDue = isNewVendorCb.checked
    ? 0
    : (appState.vendors.find(v => v.name === confirmVendorSelect.value)?.due || 0);
  const totalDue = previousDue + todaysBill;

  if (confirmTodaysBill) confirmTodaysBill.textContent = formatCurrency(todaysBill);
  if (confirmPreviousDue) confirmPreviousDue.textContent = formatCurrency(previousDue);
  confirmTotalBp.textContent = formatCurrency(totalBp);
  confirmTotalSp.textContent = formatCurrency(totalDue);
}

// ----------------------
// EVENT BINDINGS
// ----------------------

// Toggle Settings Modal (Simplifed to just API key)
settingsBtn.addEventListener("click", () => {
  apiKeyInput.value = appState.apiKey;
  apiSaveFeedback.textContent = "";
  apiSaveFeedback.style.color = "";
  // Sync the merchant mode toggle to current state
  const toggle = document.getElementById("merchant-mode-toggle");
  const modeLabel = document.getElementById("merchant-mode-label");
  if (toggle) toggle.checked = appState.merchantMode === true;
  if (modeLabel) modeLabel.textContent = appState.merchantMode ? "🟢 Merchant Mode (Sai Pavan)" : "🔵 Dev Mode (Testing)";
  settingsModal.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

saveSettingsBtn.addEventListener("click", async () => {
  appState.apiKey = apiKeyInput.value.trim();
  const result = await saveStore();
  if (result) {
    apiSaveFeedback.textContent = "Gemini key saved to cloud successfully.";
    apiSaveFeedback.style.color = "#10b981";
  } else {
    apiSaveFeedback.textContent = "Failed to save key to cloud. Check console or network.";
    apiSaveFeedback.style.color = "#f97316";
  }
  settingsModal.classList.add("hidden");
  renderAll();
});

// Merchant Mode toggle — live switch, saved immediately to Firestore
document.addEventListener("change", async (e) => {
  if (e.target && e.target.id === "merchant-mode-toggle") {
    const wasDevMode = !appState.merchantMode;
    appState.merchantMode = e.target.checked;
    const modeLabel = document.getElementById("merchant-mode-label");
    if (modeLabel) {
      modeLabel.textContent = appState.merchantMode ? "🟢 Merchant Mode (Sai Pavan)" : "🔵 Dev Mode (Testing)";
    }

    if (appState.merchantMode && wasDevMode) {
      // Switching from Dev to Merchant Mode!
      // Restore the snapshot
      let snapshot = appState.merchantSnapshot;
      if (!snapshot) {
        // Try local storage as fallback
        const localSnap = localStorage.getItem("aeonian_merchant_snapshot");
        if (localSnap) {
          try {
            snapshot = JSON.parse(localSnap);
          } catch (err) {
            console.error("Error parsing local snapshot:", err);
          }
        }
      }

      if (snapshot) {
        console.log("🔄 Restoring merchant state from snapshot...");
        appState.vendors = JSON.parse(JSON.stringify(snapshot.vendors));
        appState.inventory = JSON.parse(JSON.stringify(snapshot.inventory));
        appState.purchaseLogs = JSON.parse(JSON.stringify(snapshot.purchaseLogs || []));
      } else {
        console.warn("⚠️ No merchant snapshot found to restore!");
      }
    }

    try {
      await saveStore();
      logEvent("mode_switched", { merchantMode: appState.merchantMode });
      console.log(`🔄 Mode switched to: ${appState.merchantMode ? "Merchant" : "Dev"}`);
      // Re-render UI to reflect restored state or dev status update
      renderVendorsList(searchInput.value);
      updateDashboardMetrics();
      renderAnalytics();
      renderStockDebitLogs();
      updateAPIStatusUI();
      checkStockAlerts();
    } catch (err) {
      console.error("Error switching mode, saving or rendering:", err);
    }
  }
});

defaultResetBtn.addEventListener("click", () => {
  if (!confirm("Reset vendors, dues, orders, collections, and inventory back to default test data?")) {
    return;
  }
  resetAppToDefaults();
  settingsModal.classList.add("hidden");
});

monthlyResetBtn.addEventListener("click", async () => {
  const monthLabel = formatMonthLabel(selectedAnalyticsMonth);
  if (!confirm(`Archive and reset analytics entries for ${monthLabel}? Vendor due amounts will remain as they are.`)) {
    return;
  }
  await resetSelectedMonthAnalytics();
  settingsModal.classList.add("hidden");
});

analyticsMonthSelect.addEventListener("change", () => {
  selectedAnalyticsMonth = analyticsMonthSelect.value;
  renderAnalytics();
});

// Toggle Voice Modal
voiceTriggerBtn.addEventListener("click", () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Microphone not supported on this browser. You can still use manual entry.");
    openOrderConfirmation({ vendorName: "", items: [], isNewVendor: true, source: "local" }, "Manual Entry");
    return;
  }

  logEvent("mic_tapped");
  voiceOverlay.classList.remove("hidden");
  startAudioRecording();
});

voiceCancelBtn.addEventListener("click", () => {
  abortAudioRecording();
  voiceOverlay.classList.add("hidden");
});

voiceStopBtn.addEventListener("click", () => {
  stopAudioRecording();
  // onstop handler takes over from here
});

// Confirmation Modal bindings
closeConfirmBtn.addEventListener("click", () => confirmModal.classList.add("hidden"));
cancelConfirmBtn.addEventListener("click", () => confirmModal.classList.add("hidden"));
closeVendorLogBtn.addEventListener("click", () => vendorLogModal.classList.add("hidden"));

vendorLogDateFilter.addEventListener("change", () => {
  if (activeVendorLogIndex !== null) renderVendorLogs(activeVendorLogIndex);
});

clearVendorLogDateBtn.addEventListener("click", () => {
  vendorLogDateFilter.value = "";
  if (activeVendorLogIndex !== null) renderVendorLogs(activeVendorLogIndex);
});

stockLogMonthSelect.addEventListener("change", () => {
  selectedStockLogMonth = stockLogMonthSelect.value;
  renderStockDebitLogs();
});

if (stockLogDateFilter) {
  stockLogDateFilter.addEventListener("change", () => {
    renderStockDebitLogs();
  });
}

if (clearStockLogDateBtn) {
  clearStockLogDateBtn.addEventListener("click", () => {
    stockLogDateFilter.value = "";
    renderStockDebitLogs();
  });
}

isNewVendorCb.addEventListener("change", () => {
  if (isNewVendorCb.checked) {
    confirmVendorSelect.classList.add("hidden");
    confirmNewVendorInput.classList.remove("hidden");
  } else {
    confirmVendorSelect.classList.remove("hidden");
    confirmNewVendorInput.classList.add("hidden");
  }
  recalculateConfirmationTotals();
});

confirmVendorSelect.addEventListener("change", recalculateConfirmationTotals);

addItemRowBtn.addEventListener("click", () => {
  if (appState.inventory.length > 0) {
    addItemRow(appState.inventory[0].name, 1);
    recalculateConfirmationTotals();
  } else {
    alert("Please add products in the Stock tab first!");
  }
});

saveConfirmBtn.addEventListener("click", () => {
  // 1. Get vendor name
  let targetVendorName = "";
  const isNew = isNewVendorCb.checked;

  if (isNew) {
    targetVendorName = confirmNewVendorInput.value.trim();
    if (!targetVendorName) {
      alert("Please enter a name for the new vendor.");
      return;
    }
  } else {
    targetVendorName = confirmVendorSelect.value;
  }

  // 2. Gather items & Deduct Stock
  const orders = [];
  let totalSp = 0;
  const rows = confirmItemsList.querySelectorAll(".confirm-item-row");

  rows.forEach(row => {
    const select = row.querySelector(".confirm-item-select");
    const qtyInput = row.querySelector(".confirm-qty-input");
    const priceInput = row.querySelector(".confirm-price-input");

    const itemName = select.value;
    const qty = parseInt(qtyInput.value) || 0;
    const customSp = parseFloat(priceInput.value) || 0;

    if (qty > 0) {
      const matchedInv = appState.inventory.find(i => i.name === itemName);
      if (matchedInv) {
        orders.push({
          itemName: itemName,
          quantity: qty,
          sp: customSp,
          bp: matchedInv.bp,
          timestamp: new Date().toISOString(),
          monthKey: getMonthKey(new Date())
        });
        totalSp += customSp * qty;

        // Deduct inventory stock
        matchedInv.stock = Math.max(0, (matchedInv.stock || 0) - qty);
      }
    }
  });

  if (orders.length === 0) {
    alert("Please select at least one item with a valid quantity!");
    return;
  }

  // 3. Find or Create Vendor
  let vendor = appState.vendors.find(v => v.name.toLowerCase() === targetVendorName.toLowerCase());
  if (!vendor) {
    vendor = {
      name: targetVendorName,
      due: 0,
      orders: [],
      history: [],
      lastUpdated: Date.now()
    };
    appState.vendors.unshift(vendor);
  } else {
    vendor.lastUpdated = Date.now();
  }

  // 4. Update vendor record
  vendor.due += totalSp;
  vendor.orders = [...vendor.orders, ...orders];

  saveStore().catch(console.error);
  applyPendingBpIfStockDepleted();
  logEvent("order_saved", {
    vendorName: targetVendorName,
    itemCount: orders.length,
    totalAmount: totalSp,
    source: "voice"
  });
  confirmModal.classList.add("hidden");
  renderAll();
  checkStockAlerts();

  if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
});

// Search input events
searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query.trim()) {
    clearSearchBtn.classList.remove("hidden");
  } else {
    clearSearchBtn.classList.add("hidden");
  }
  renderVendorsList(query);
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearSearchBtn.classList.add("hidden");
  renderVendorsList("");
});

// Update settings UI status labels + merchant mode toggle
function updateAPIStatusUI() {
  if (appState.apiKey) {
    apiStatusDot.className = "status-dot online";
    apiStatusText.textContent = "Gemini LLM Active";
  } else {
    apiStatusDot.className = "status-dot offline";
    apiStatusText.textContent = "Using Local Regex Fallback (Offline)";
  }
  // Sync merchant mode toggle state
  const toggle = document.getElementById("merchant-mode-toggle");
  const modeLabel = document.getElementById("merchant-mode-label");
  if (toggle && modeLabel) {
    toggle.checked = appState.merchantMode === true;
    modeLabel.textContent = appState.merchantMode ? "🟢 Merchant Mode (Sai Pavan)" : "🔵 Dev Mode (Testing)";
  }
}

// ----------------------
// INIT
// ----------------------
async function renderAll() {
  await initStore();
  renderVendorsList(searchInput.value);
  updateDashboardMetrics();
  renderAnalytics();
  renderStockDebitLogs();
  updateAPIStatusUI();
  checkStockAlerts();
  console.log("✨ App rendered successfully");
}

renderAll();


// ============================================================
// CALL RECORDING FILE UPLOAD INTEGRATION
// ============================================================

// Wrap inside a DOMContentLoaded safety check or execute directly
// near your other voice overlay controls
setTimeout(() => {
  const fileUploadBtn = document.getElementById("file-upload-btn");
  const audioFileInput = document.getElementById("audio-file-input");

  if (!fileUploadBtn || !audioFileInput) {
    console.error("❌ Audio upload DOM elements missing! Check your HTML IDs.");
    return;
  }

  console.log("🚀 Call recording upload event listeners successfully initialized.");

  // Set accept to audio formats used by WhatsApp (ogg/m4a), Voice Memos (m4a/mp4),
  // and standard recordings — iOS Files app will filter to matching files automatically.
  audioFileInput.accept = "audio/*,.m4a,.ogg,.mp3,.mp4,.wav,.webm,.aac,.opus";

  // 1. Trigger the native hidden file browser panel
  fileUploadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("📂 Upload button clicked. Opening device file picker...");
    audioFileInput.click();
  });

  // 2. Process the chosen file stream
  audioFileInput.addEventListener("change", async function(event) {
    console.log("🗂️ Change event captured on file input element.");

    const file = event.target.files?.[0];
    if (!file) {
      console.warn("⚠️ File picker opened, but no file was selected.");
      return;
    }

    console.log(`🎵 File selected: ${file.name} | Type: ${file.type} | Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    // Open the processing UI overlay instantly so the user knows something is happening
    const voiceOverlay = document.getElementById("voice-overlay");
    const voiceTranscriptPreview = document.getElementById("voice-transcript-preview");
    const voiceStatusText = document.getElementById("voice-status-text");

    if (voiceOverlay) voiceOverlay.classList.remove("hidden");
    if (voiceTranscriptPreview) {
      voiceTranscriptPreview.classList.remove("placeholder-text");
      voiceTranscriptPreview.textContent = `Reading call clip: ${file.name}...`;
    }
    if (voiceStatusText) voiceStatusText.textContent = "Converting audio stream...";

    try {
      console.log("⏳ Converting raw file into base64 format...");
      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      console.log("📡 Base64 conversion complete. Dispatching payload directly to Gemini API parser...");
      if (voiceTranscriptPreview) voiceTranscriptPreview.textContent = "Parsing transaction details with LLM engine...";
      if (voiceStatusText) voiceStatusText.textContent = "Sending to Gemini...";

      const parsedResult = await runGeminiAudioParser(base64Audio, file.type || "audio/webm");

      console.log("✅ Gemini API responded successfully:", parsedResult);
      if (voiceOverlay) voiceOverlay.classList.add("hidden");

      openOrderConfirmation(parsedResult, parsedResult._transcript || `Call file: ${file.name}`);

    } catch (err) {
      console.error("❌ File parsing or API transmission failed:", err);

      if (voiceStatusText) voiceStatusText.textContent = "API error. Switching to manual override...";
      if (voiceTranscriptPreview) voiceTranscriptPreview.textContent = err.message;

      setTimeout(() => {
        if (voiceOverlay) voiceOverlay.classList.add("hidden");
        openOrderConfirmation(
          { vendorName: "", items: [], isNewVendor: true, source: "manual" },
          `Audio Pipeline Fail — ${file.name}`
        );
      }, 1500);
    } finally {
      // Clear out the tracking string value so the change mechanism triggers again back-to-back
      this.value = null;
      console.log("🧹 Input stream flushed and ready for next file.");
    }
  });

  // 3. Camera Note Capture trigger
  if (cameraTriggerBtn && cameraFileInput) {
    console.log("📸 Camera event listeners successfully initialized.");

    cameraTriggerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("📸 Camera button clicked. Opening camera/image picker...");
      cameraFileInput.click();
    });

    cameraFileInput.addEventListener("change", async function(event) {
      console.log("🗂️ Camera file select event captured.");

      const file = event.target.files?.[0];
      if (!file) {
        console.warn("⚠️ Camera file picker opened, but no image was selected.");
        return;
      }

      console.log(`🖼️ Image selected: ${file.name} | Type: ${file.type} | Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

      const voiceOverlay = document.getElementById("voice-overlay");
      const voiceTranscriptPreview = document.getElementById("voice-transcript-preview");
      const voiceStatusText = document.getElementById("voice-status-text");

      if (voiceOverlay) voiceOverlay.classList.remove("hidden");
      if (voiceTranscriptPreview) {
        voiceTranscriptPreview.classList.remove("placeholder-text");
        voiceTranscriptPreview.textContent = `Reading note image: ${file.name}...`;
      }
      if (voiceStatusText) voiceStatusText.textContent = "Converting image stream...";

      try {
        console.log("⏳ Converting image to base64 format...");
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        console.log("📡 Base64 conversion complete. Dispatching payload directly to Gemini Image parser...");
        if (voiceTranscriptPreview) voiceTranscriptPreview.textContent = "Parsing handwritten order with LLM engine...";
        if (voiceStatusText) voiceStatusText.textContent = "Sending to Gemini...";

        const parsedResult = await runGeminiImageParser(base64Image, file.type || "image/jpeg");

        console.log("✅ Gemini Image API responded successfully:", parsedResult);
        if (voiceOverlay) voiceOverlay.classList.add("hidden");

        openOrderConfirmation(parsedResult, parsedResult._transcript || `Image note: ${file.name}`);

      } catch (err) {
        console.error("❌ Image parsing or API transmission failed:", err);

        if (voiceStatusText) voiceStatusText.textContent = "API error. Switching to manual override...";
        if (voiceTranscriptPreview) voiceTranscriptPreview.textContent = err.message;

        setTimeout(() => {
          if (voiceOverlay) voiceOverlay.classList.add("hidden");
          openOrderConfirmation(
            { vendorName: "", items: [], isNewVendor: true, source: "manual" },
            `Image Pipeline Fail — ${file.name}`
          );
        }, 1500);
      } finally {
        this.value = null;
        console.log("🧹 Input stream flushed and ready for next photo.");
      }
    });
  }
}, 500); // 500ms delay ensures Firestore/App state rendering scripts finish first
