const API_URL = "http://localhost:8000/predict"; // or 127.0.0.1

const el = (id) => document.getElementById(id);

function setStatus(msg) {
  el("status").textContent = msg;
}

function setLoading(isLoading) {
  const spinner = el("spinner");
  const btn = el("predictBtn");

  if (spinner) spinner.style.display = isLoading ? "inline-block" : "none";
  if (btn) {
    btn.disabled = isLoading;
    btn.style.opacity = isLoading ? "0.85" : "1";
  }
}

function getPayload() {
  // Read values safely
  return {
    district: el("district").value.trim(),
    month: Number(el("month").value),

    temp_avg: Number(el("temp").value),
    precipitation_avg: Number(el("rain").value),
    humidity_avg: Number(el("hum").value),

    cases_lag1: Number(el("lag1").value),
    cases_lag2: Number(el("lag2").value),
    cases_lag3: Number(el("lag3").value),
  };
}

function validatePayload(payload) {
  if (!payload.district) {
    return "Please select a district.";
  }

  // Map payload keys -> input ids (no nested ternary)
  const fieldMap = {
    temp_avg: "temp",
    precipitation_avg: "rain",
    humidity_avg: "hum",
    cases_lag1: "lag1",
    cases_lag2: "lag2",
    cases_lag3: "lag3",
  };

  for (const [key, inputId] of Object.entries(fieldMap)) {
    const raw = el(inputId).value.trim();

    // Empty string check
    if (raw === "") {
      return `Please fill ${key}.`;
    }

    // Numeric check
    if (!Number.isFinite(payload[key])) {
      return `${key} must be a valid number.`;
    }
  }

  // Month check (optional)
  if (!Number.isFinite(payload.month) || payload.month < 1 || payload.month > 12) {
    return "Month must be between 1 and 12.";
  }

  return null; // valid
}

async function callPredict(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }

  return res.json();
}

function renderResult(data) {
  // If you have these elements in UI
  const predValue = el("predValue");
  const predMeta = el("predMeta");

  const rounded = Math.round(data.predicted_cases);

  if (predValue) predValue.textContent = `${rounded}`;
  if (predMeta) predMeta.textContent = `District: ${data.district} • Month: ${data.month}`;
}

async function onPredictClick() {
  setStatus("");
  setLoading(true);

  try {
    const payload = getPayload();
    const error = validatePayload(payload);

    if (error) {
      setStatus(`${error}`);
      return;
    }

    setStatus(" Predicting...");
    const data = await callPredict(payload);

    setStatus(" Prediction successful");
    renderResult(data);
  } catch (err) {
    console.error(err);
    setStatus(" API error (check backend is running)");
  } finally {
    setLoading(false);
  }
}

// Hook button
el("predictBtn").addEventListener("click", onPredictClick);