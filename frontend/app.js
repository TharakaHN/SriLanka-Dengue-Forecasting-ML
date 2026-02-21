// const API_URL = "http://127.0.0.1:8000/predict";

const API_URL = "http://localhost:8000/predict";
const el = (id) => document.getElementById(id);

// Keep month select at default (June=6) on page load and when district changes
const setDefaultMonth = (val = "") => {
  const m = el("month");
  if (m) m.value = String(val);
};
document.addEventListener("DOMContentLoaded", () => setDefaultMonth());
const _districtEl = el("district");
if (_districtEl) _districtEl.addEventListener("change", () => setDefaultMonth());

const setLoading = (isLoading) => {
  el("spinner").style.display = isLoading ? "inline-block" : "none";
  el("predictBtn").disabled = isLoading;
  el("predictBtn").style.opacity = isLoading ? "0.85" : "1";
};

el("predictBtn").addEventListener("click", async () => {
  el("status").textContent = "";
  el("predValue").textContent = "—";
  el("predMeta").textContent = "District: — • Month: —";

  const payload = {
    district: el("district").value,
    month: Number(el("month").value),

    temp_avg: Number(el("temp").value),
    precipitation_avg: Number(el("rain").value),
    humidity_avg: Number(el("hum").value),

    cases_lag1: Number(el("lag1").value),
    cases_lag2: Number(el("lag2").value),
    cases_lag3: Number(el("lag3").value),
  };

  // Basic validation
  if (!payload.district) {
    el("status").textContent = " Please select a district.";
    return;
  }

  // If someone leaves numeric fields empty -> Number("") = 0 (bad)
  // So check NaN / empty explicitly:
  const numericKeys = ["temp_avg","precipitation_avg","humidity_avg","cases_lag1","cases_lag2","cases_lag3"];
  for (const k of numericKeys) {
    if (!Number.isFinite(payload[k]) || String(el(k === "temp_avg" ? "temp" :
      k === "precipitation_avg" ? "rain" :
      k === "humidity_avg" ? "hum" :
      k === "cases_lag1" ? "lag1" :
      k === "cases_lag2" ? "lag2" : "lag3").value).trim() === "") {
      el("status").textContent = ` Please fill ${k}.`;
      return;
    }
  }

  setLoading(true);
  el("status").textContent = " Predicting...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt);
    }

    const data = await res.json();
    const pred = data.predicted_cases;

    el("status").textContent = " Prediction successful";
    el("predValue").textContent = `${Math.round(pred)}`;
    el("predMeta").textContent = `District: ${data.district} • Month: ${data.month}`;
  } catch (err) {
    el("status").textContent = " API error (is backend running?)";
    el("predMeta").textContent = "";
    el("predValue").textContent = "—";
    console.error(err);
  } finally {
    setLoading(false);
  }
});