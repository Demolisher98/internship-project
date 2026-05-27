import './style.css';

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
  { id: "buffey_plates", name: "Buffey Plates", sp: 220, bp: 180, stock: 75, maxStock: 100, unit: "pack (100 pcs)" },
  { id: "paper_cups", name: "Paper Cups", sp: 60, bp: 40, stock: 5, maxStock: 100, unit: "pack (100 pcs)" }, // Low default for testing
  { id: "plastic_spoons", name: "Plastic Spoons", sp: 45, bp: 30, stock: 90, maxStock: 100, unit: "pack (100 pcs)" },
  { id: "wooden_spoons", name: "Wooden Spoons", sp: 70, bp: 50, stock: 15, maxStock: 100, unit: "pack (100 pcs)" }, // Med default for testing
  { id: "foil_containers", name: "Aluminium Foil Container", sp: 350, bp: 280, stock: 30, maxStock: 100, unit: "pack (100 pcs)" }, // Med default
  { id: "juice_glasses", name: "Juice Glasses", sp: 120, bp: 90, stock: 8, maxStock: 100, unit: "pack (50 pcs)" }, // Low default
  { id: "falooda_glasses", name: "Falooda Glasses", sp: 190, bp: 150, stock: 35, maxStock: 100, unit: "pack (50 pcs)" }, // Med default
  { id: "tissues", name: "Tissues", sp: 100, bp: 70, stock: 50, maxStock: 100, unit: "pack (1000 pcs)" },
  { id: "packaging_bags", name: "Packaging Bags", sp: 140, bp: 110, stock: 12, maxStock: 20, unit: "kg" },
  { id: "garbage_bags", name: "Garbage Bags", sp: 110, bp: 80, stock: 25, maxStock: 30, unit: "pack (30 pcs)" },
  { id: "parota_wrapping", name: "Parota Wrapping Paper", sp: 160, bp: 120, stock: 8, maxStock: 10, unit: "bundle" }
];

// App State Management
let appState = {
  vendors: [],
  inventory: [],
  apiKey: ""
};

// Initial state setup
function initStore() {
  const storedState = localStorage.getItem("union_packages_state");
  const storedKey = localStorage.getItem("union_packages_api_key");
  const storedInventory = localStorage.getItem("union_packages_inventory");
  
  if (storedKey) {
    appState.apiKey = storedKey;
  }
  
  // Initialize inventory with stock levels
  if (storedInventory) {
    appState.inventory = JSON.parse(storedInventory);
  } else {
    appState.inventory = JSON.parse(JSON.stringify(INVENTORY_STATIC_DEFAULTS));
    localStorage.setItem("union_packages_inventory", JSON.stringify(appState.inventory));
  }
  
  // Initialize vendors
  if (storedState) {
    appState.vendors = JSON.parse(storedState);
    appState.vendors.forEach(v => {
      if (v.lastUpdated === undefined) v.lastUpdated = 0;
      if (!v.orders) v.orders = [];
      if (!v.history) v.history = [];
    });
  } else {
    // Populate defaults with ₹0 due amount
    appState.vendors = VENDORS_STATIC.map(name => ({
      name: name,
      due: 0,
      orders: [],
      history: [],
      lastUpdated: 0
    }));
    saveStore();
  }
}

function saveStore() {
  localStorage.setItem("union_packages_state", JSON.stringify(appState.vendors));
  localStorage.setItem("union_packages_api_key", appState.apiKey);
  localStorage.setItem("union_packages_inventory", JSON.stringify(appState.inventory));
}

// DOM elements hooks
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
const apiStatusDot = document.querySelector(".api-status-badge .status-dot");
const defaultResetBtn = document.getElementById("default-reset-btn");
const monthlyResetBtn = document.getElementById("monthly-reset-btn");

const voiceTriggerBtn = document.getElementById("voice-trigger-btn");
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
const confirmTotalBp = document.getElementById("confirm-total-bp");
const confirmTotalSp = document.getElementById("confirm-total-sp");

const vendorLogModal = document.getElementById("vendor-log-modal");
const closeVendorLogBtn = document.getElementById("close-vendor-log-btn");
const vendorLogTitle = document.getElementById("vendor-log-title");
const vendorLogSubtitle = document.getElementById("vendor-log-subtitle");
const vendorLogList = document.getElementById("vendor-log-list");

// Navigation Tabs
const tabButtons = document.querySelectorAll(".app-tab-bar .tab-btn");
const tabViews = document.querySelectorAll(".tab-view");
const tabStockAlertDot = document.getElementById("tab-stock-alert-dot");
const stockAlertsBanner = document.getElementById("stock-alerts-banner");
const stockAlertsMsg = document.getElementById("stock-alerts-msg");

// Stock Tab
const tabInventoryList = document.getElementById("tab-inventory-list");
const tabAddProductBtn = document.getElementById("tab-add-product-btn");

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

// Speech Recognition Init
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN'; 
  
  recognition.onstart = () => {
    isRecording = true;
    voiceStatusText.textContent = "Listening... Speak now";
    voiceTranscriptPreview.textContent = "";
    voiceTranscriptPreview.classList.add("placeholder-text");
    if (navigator.vibrate) navigator.vibrate(40);
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    
    const displayVal = finalTranscript || interimTranscript || "Listening to speech...";
    voiceTranscriptPreview.textContent = displayVal;
    voiceTranscriptPreview.classList.remove("placeholder-text");
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    voiceStatusText.textContent = `Error: ${event.error}`;
  };

  recognition.onend = () => {
    isRecording = false;
  };
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

  statDue.textContent = `₹${totalDue}`;
  statCollected.textContent = `₹${totalCollected}`;
  statSales.textContent = `₹${totalSales}`;
  statProfit.textContent = `₹${totalProfit}`;
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
  appState.apiKey = preservedApiKey;
  selectedAnalyticsMonth = getMonthKey(new Date());
  saveStore();
  renderStockTabList();
  renderDirectoryList();
  renderAll();
}

function resetSelectedMonthAnalytics() {
  const monthKey = selectedAnalyticsMonth || getMonthKey(new Date());
  appState.vendors.forEach(vendor => {
    vendor.orders = (vendor.orders || []).filter(order => getRecordMonth(order) !== monthKey);
    vendor.history = (vendor.history || []).filter(payment => getRecordMonth(payment) !== monthKey);
    if ((vendor.orders || []).length === 0 && (vendor.history || []).length === 0) {
      vendor.lastUpdated = vendor.due > 0 ? vendor.lastUpdated : 0;
    }
  });
  saveStore();
  renderAll();
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

  (vendor.history || []).forEach(payment => {
    const date = getRecordDate(payment, vendor);
    logs.push({
      type: "Collection",
      date,
      amount: payment.amount || 0,
      description: "Cash collected",
      meta: "Payment received"
    });
  });

  logs.sort((a, b) => b.date - a.date);
  vendorLogTitle.textContent = `${vendor.name} Logs`;
  vendorLogSubtitle.textContent = `${logs.length} entries • Current due ${formatCurrency(vendor.due || 0)}`;
  vendorLogList.innerHTML = "";

  if (logs.length === 0) {
    renderEmptyAnalytics(vendorLogList, "No orders or collections recorded for this vendor yet.");
    vendorLogModal.classList.remove("hidden");
    return;
  }

  const groupedByMonth = new Map();
  logs.forEach(log => {
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

        row.append(left, amount);
        dayBlock.appendChild(row);
      });

      monthBlock.appendChild(dayBlock);
    });

    vendorLogList.appendChild(monthBlock);
  });

  vendorLogModal.classList.remove("hidden");
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
          ${vendor.orders.map(order => `
            <div class="order-item-row">
              <div class="item-name-qty">
                <span class="item-name">${order.itemName}</span>
                <span class="item-qty">x${order.quantity}</span>
              </div>
              <div class="item-prices-sub">
                <span class="item-unit-price">@ ₹${order.sp}</span>
                <span class="item-total-price">₹${order.sp * order.quantity}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    let historyLabel = "";
    const totalCollected = vendor.history.reduce((sum, p) => sum + p.amount, 0);
    if (totalCollected > 0) {
      historyLabel = `<span class="collection-history-tag">Total Paid: ₹${totalCollected}</span>`;
    }

    card.innerHTML = `
      <div class="vendor-card-header">
        <div>
          <h2 class="vendor-title">${vendor.name}</h2>
          <div class="vendor-date">${vendor.lastUpdated > 0 ? `Updated ${new Date(vendor.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'No recent activity'}</div>
        </div>
        <button class="delete-vendor-btn" data-index="${originalIndex}" title="Reset Dues & Orders">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
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

      <!-- Money Collection Form -->
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
      <button class="vendor-log-link" data-index="${originalIndex}">View month/day logs</button>
    `;

    vendorsContainer.appendChild(card);
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
        saveStore();
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

  document.querySelectorAll(".vendor-log-link").forEach(btn => {
    btn.addEventListener("click", () => {
      renderVendorLogs(parseInt(btn.getAttribute("data-index")));
    });
  });
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

  saveStore();
  renderAll();
  
  if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
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
      <button class="delete-item-row-btn" data-index="${index}">&times;</button>
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

      saveStore();
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

  // Attach delete listeners
  tabInventoryList.querySelectorAll(".delete-item-row-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      if (confirm(`Remove product "${appState.inventory[idx].name}" from catalog?`)) {
        appState.inventory.splice(idx, 1);
        saveStore();
        renderStockTabList();
        checkStockAlerts();
      }
    });
  });
}

tabAddProductBtn.addEventListener("click", () => {
  appState.inventory.push({
    id: "custom_" + Date.now(),
    name: "New Product",
    bp: 0,
    sp: 0,
    stock: 80,
    maxStock: 100,
    unit: "pack"
  });
  saveStore();
  renderStockTabList();
  
  // Auto scroll to bottom
  const container = document.querySelector("#view-stock .settings-scroll-body");
  container.scrollTop = container.scrollHeight;
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
      saveStore();
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

  saveStore();
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

  // Match vendor name (use dynamic appState.vendors names)
  for (const v of appState.vendors) {
    if (text.includes(v.name.toLowerCase())) {
      matchedVendor = v.name;
      break;
    }
  }

  // Parse products and quantities
  const quantityRegexStr = "(\\d+|one|two|three|four|five|six|seven|eight|nine|ten|okati|oka|rendu|render|moodu|nalugu|aidu)";
  
  appState.inventory.forEach(item => {
    let keywords = [item.name.toLowerCase()];
    
    // Default abbreviations / synonyms
    if (item.name.includes("Buffey Plates")) keywords.push("plates", "plate", "buffey");
    if (item.name.includes("Paper Cups")) keywords.push("cups", "cup", "tea cups");
    if (item.name.includes("Plastic Spoons")) keywords.push("plastic spoons", "spoons", "spoon");
    if (item.name.includes("Wooden Spoons")) keywords.push("wooden spoons", "wood spoons", "wooden");
    if (item.name.includes("Aluminium Foil")) keywords.push("foil", "container", "aluminium container", "box", "boxes");
    if (item.name.includes("Juice Glasses")) keywords.push("juice glasses", "glass", "glasses", "rose milk cups");
    if (item.name.includes("Falooda Glasses")) keywords.push("falooda glasses", "falooda glass", "falooda");
    if (item.name.includes("Tissues")) keywords.push("tissues", "tissue", "paper tissues");
    if (item.name.includes("Packaging Bags")) keywords.push("bags", "bag", "packaging");
    if (item.name.includes("Garbage Bags")) keywords.push("garbage", "garbage bags", "dustbin bags");
    if (item.name.includes("Parota Wrapping")) keywords.push("parota wrapping", "wrapping paper", "wrap", "parota wrap");

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

// Call Google Gemini API
async function runGeminiParser(transcript) {
  if (!appState.apiKey) {
    throw new Error("No API key configured");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${appState.apiKey}`;
  
  const systemInstructions = `
You are an AI order processing parser for "Union Packages", a B2B food service disposable products distributor in Vijayawada.
You will extract the vendor name and ordered inventory items from speech transcripts (which might be in English, Telugu, or mixed Tanglish/Telugu-English).

Available Vendors List (dynamic):
${JSON.stringify(appState.vendors.map(v => v.name))}

Available Product Inventory List (dynamic):
${JSON.stringify(appState.inventory.map(i => i.name))}

Matching Instructions:
1. Fuzzy-match the vendor name to the closest one in the Vendors List. If no close match exists, output the spoken vendor name and set "isNewVendor" to true.
2. Fuzzy-match the items to the Product Inventory List. 
3. Convert all Telugu number terms to digits: "okati"/"oka"->1, "rendu"/"render"->2, "moodu"->3, "nalugu"->4, "aidu"->5, "aaru"->6, "edu"->7, "enimidi"->8, "tommidi"->9, "padi"->10.
4. Output strict JSON containing ONLY the properties: "vendorName" (string), "isNewVendor" (boolean), and "items" (array of objects with "name" and "qty"). Do not write any markdown blocks.

Examples:
- Speech: "Araku Biryani ki three plates bundles and okati spoons"
  Output: {"vendorName": "Araku Biryani", "isNewVendor": false, "items": [{"name": "Buffey Plates", "qty": 3}, {"name": "Plastic Spoons", "qty": 1}]}
- Speech: "add new vendor street food corner with 2 boxes tissues"
  Output: {"vendorName": "Street Food Corner", "isNewVendor": true, "items": [{"name": "Tissues", "qty": 2}]}
- Speech: "Thindhamra Mama 5 paper cups packs"
  Output: {"vendorName": "Thindhamra Mama", "isNewVendor": false, "items": [{"name": "Paper Cups", "qty": 5}]}
`;

  const payload = {
    contents: [{
      parts: [{
        text: `Parse the following speech transcript:\n"${transcript}"`
      }]
    }],
    systemInstruction: {
      parts: [{
        text: systemInstructions
      }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Gemini API Error: Status ${response.status} - ${errorDetails}`);
  }

  const result = await response.json();
  const jsonText = result.candidates[0].content.parts[0].text;
  
  const parsedData = JSON.parse(jsonText);
  return {
    vendorName: parsedData.vendorName || "",
    items: parsedData.items || [],
    isNewVendor: !!parsedData.isNewVendor,
    source: "gemini"
  };
}

// ----------------------
// MODAL WORKFLOW ACTIONS
// ----------------------

function openOrderConfirmation(parsedData, rawTranscript) {
  confirmRawTranscript.textContent = `"${rawTranscript}"`;
  parserBadge.textContent = parsedData.source === "gemini" ? "Gemini LLM" : "Local Fallback";
  parserBadge.style.background = parsedData.source === "gemini" ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)";
  parserBadge.style.color = parsedData.source === "gemini" ? "var(--accent-blue)" : "var(--accent-amber)";
  
  // Reset confirmation selectors using current dynamic vendors list
  confirmVendorSelect.innerHTML = "";
  appState.vendors.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = v.name;
    confirmVendorSelect.appendChild(opt);
  });

  isNewVendorCb.checked = !!parsedData.isNewVendor;
  
  if (parsedData.isNewVendor) {
    confirmVendorSelect.classList.add("hidden");
    confirmNewVendorInput.classList.remove("hidden");
    confirmNewVendorInput.value = parsedData.vendorName || "";
  } else {
    confirmVendorSelect.classList.remove("hidden");
    confirmNewVendorInput.classList.add("hidden");
    
    if (parsedData.vendorName) {
      const matched = appState.vendors.find(v => v.name.toLowerCase() === parsedData.vendorName.toLowerCase()) || appState.vendors[0];
      confirmVendorSelect.value = matched ? matched.name : "";
    } else {
      confirmVendorSelect.selectedIndex = 0;
    }
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

function addItemRow(selectedName = "", qty = 1) {
  const row = document.createElement("div");
  row.className = "confirm-item-row";
  
  const select = document.createElement("select");
  select.className = "confirm-item-select";
  appState.inventory.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.name;
    opt.textContent = `${item.name} (₹${item.sp}) - Stock: ${item.stock}`;
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

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-item-row-btn";
  removeBtn.innerHTML = "&times;";
  removeBtn.addEventListener("click", () => {
    row.remove();
    recalculateConfirmationTotals();
  });

  select.addEventListener("change", recalculateConfirmationTotals);
  qtyInput.addEventListener("input", recalculateConfirmationTotals);

  row.appendChild(select);
  row.appendChild(qtyInput);
  row.appendChild(removeBtn);
  confirmItemsList.appendChild(row);
}

function recalculateConfirmationTotals() {
  let totalBp = 0;
  let totalSp = 0;

  const rows = confirmItemsList.querySelectorAll(".confirm-item-row");
  rows.forEach(row => {
    const select = row.querySelector(".confirm-item-select");
    const qtyInput = row.querySelector(".confirm-qty-input");
    
    const itemName = select.value;
    const qty = parseInt(qtyInput.value) || 0;
    
    const matchedInv = appState.inventory.find(i => i.name === itemName);
    if (matchedInv) {
      totalBp += matchedInv.bp * qty;
      totalSp += matchedInv.sp * qty;
    }
  });

  confirmTotalBp.textContent = `₹${totalBp}`;
  confirmTotalSp.textContent = `₹${totalSp}`;
}

async function processSpeechTranscript(transcript) {
  if (!transcript || transcript.trim().length === 0) {
    alert("No speech transcript recorded!");
    return;
  }

  let parsedResult = null;
  
  if (appState.apiKey) {
    voiceStatusText.textContent = "Processing voice patterns with Gemini...";
    try {
      parsedResult = await runGeminiParser(transcript);
    } catch (err) {
      console.warn("Gemini API parsing failed, falling back to local:", err);
      parsedResult = runLocalFallbackParser(transcript);
    }
  } else {
    parsedResult = runLocalFallbackParser(transcript);
  }

  voiceOverlay.classList.add("hidden");
  openOrderConfirmation(parsedResult, transcript);
}

// ----------------------
// EVENT BINDINGS
// ----------------------

// Toggle Settings Modal (Simplifed to just API key)
settingsBtn.addEventListener("click", () => {
  apiKeyInput.value = appState.apiKey;
  settingsModal.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

saveSettingsBtn.addEventListener("click", () => {
  appState.apiKey = apiKeyInput.value.trim();
  saveStore();
  settingsModal.classList.add("hidden");
  renderAll();
});

defaultResetBtn.addEventListener("click", () => {
  if (!confirm("Reset vendors, dues, orders, collections, and inventory back to default test data?")) {
    return;
  }
  resetAppToDefaults();
  settingsModal.classList.add("hidden");
});

monthlyResetBtn.addEventListener("click", () => {
  const monthLabel = formatMonthLabel(selectedAnalyticsMonth);
  if (!confirm(`Reset analytics entries for ${monthLabel}? Vendor due amounts will remain as they are.`)) {
    return;
  }
  resetSelectedMonthAnalytics();
  settingsModal.classList.add("hidden");
});

analyticsMonthSelect.addEventListener("change", () => {
  selectedAnalyticsMonth = analyticsMonthSelect.value;
  renderAnalytics();
});

// Toggle Voice Modal
voiceTriggerBtn.addEventListener("click", () => {
  if (!recognition) {
    alert("Speech recognition is not supported on this browser/device. You can still use manual entry.");
    openOrderConfirmation({ vendorName: "", items: [], isNewVendor: true, source: "local" }, "Manual Entry");
    return;
  }
  
  voiceOverlay.classList.remove("hidden");
  try {
    recognition.start();
  } catch (err) {
    console.error("Failed to start Speech Recognition:", err);
  }
});

voiceCancelBtn.addEventListener("click", () => {
  if (recognition) {
    recognition.abort();
  }
  voiceOverlay.classList.add("hidden");
});

voiceStopBtn.addEventListener("click", () => {
  if (recognition) {
    recognition.stop();
  }
  const transcript = voiceTranscriptPreview.textContent;
  processSpeechTranscript(transcript);
});

// Confirmation Modal bindings
closeConfirmBtn.addEventListener("click", () => confirmModal.classList.add("hidden"));
cancelConfirmBtn.addEventListener("click", () => confirmModal.classList.add("hidden"));
closeVendorLogBtn.addEventListener("click", () => vendorLogModal.classList.add("hidden"));

isNewVendorCb.addEventListener("change", () => {
  if (isNewVendorCb.checked) {
    confirmVendorSelect.classList.add("hidden");
    confirmNewVendorInput.classList.remove("hidden");
  } else {
    confirmVendorSelect.classList.remove("hidden");
    confirmNewVendorInput.classList.add("hidden");
  }
});

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
    
    const itemName = select.value;
    const qty = parseInt(qtyInput.value) || 0;
    
    if (qty > 0) {
      const matchedInv = appState.inventory.find(i => i.name === itemName);
      if (matchedInv) {
        orders.push({
          itemName: itemName,
          quantity: qty,
          sp: matchedInv.sp,
          bp: matchedInv.bp,
          timestamp: new Date().toISOString(),
          monthKey: getMonthKey(new Date())
        });
        totalSp += matchedInv.sp * qty;

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

  saveStore();
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

// Update settings UI status labels
function updateAPIStatusUI() {
  if (appState.apiKey) {
    apiStatusDot.className = "status-dot online";
    apiStatusText.textContent = "Gemini LLM Active";
  } else {
    apiStatusDot.className = "status-dot offline";
    apiStatusText.textContent = "Using Local Regex Fallback (Offline)";
  }
}

// ----------------------
// INIT
// ----------------------
function renderAll() {
  initStore();
  renderVendorsList(searchInput.value);
  updateDashboardMetrics();
  renderAnalytics();
  updateAPIStatusUI();
  checkStockAlerts();
}

renderAll();
