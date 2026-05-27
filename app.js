const shopsContainer = document.getElementById("shopsContainer");
const calculateBtn = document.getElementById("calculateBtn");
const saveBtn = document.getElementById("saveBtn");
const resultCards = document.getElementById("resultCards");


let shopCount = 0;
let latestCalculation = null;

function generateInvoiceNumber() {
  const date = new Date();

  const invoice = `INV-${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${Date.now()
    .toString()
    .slice(-4)}`;

  document.getElementById("invoiceNumber").value = invoice;
}

generateInvoiceNumber();

document.getElementById("billingDate").valueAsDate = new Date();

function addShop() {
  shopCount++;

  const div = document.createElement("div");
  div.className = "shop-card";

  div.innerHTML = `
    <div class="between">
      <h3>Shop ${shopCount}</h3>
      <button class="btn danger remove-btn">Remove</button>
    </div>

    <div class="shop-grid">
      <input type="text" class="shop-name" value="Shop ${shopCount}">
      <input type="number" class="previous" placeholder="Previous Reading">
      <input type="number" class="current" placeholder="Current Reading">
      <input type="text" class="consumption" placeholder="Consumption" readonly>
    </div>
  `;

  shopsContainer.appendChild(div);

  const previous = div.querySelector(".previous");
  const current = div.querySelector(".current");
  const consumption = div.querySelector(".consumption");

  function updateConsumption() {
    const prev = Number(previous.value);
    const curr = Number(current.value);

    if (curr >= prev) {
      consumption.value = curr - prev;
    }
  }

  previous.addEventListener("input", updateConsumption);
  current.addEventListener("input", updateConsumption);

  div.querySelector(".remove-btn").addEventListener("click", () => {
    div.remove();
  });
}

for (let i = 0; i < 3; i++) {
  addShop();
}

document.getElementById("addShopBtn").addEventListener("click", addShop);

calculateBtn.addEventListener("click", () => {
  const totalBill = Number(document.getElementById("totalBill").value);

  const shopCards = document.querySelectorAll(".shop-card");

  let shops = [];
  let totalConsumption = 0;

  shopCards.forEach(card => {
    const shop_name = card.querySelector(".shop-name").value;
    const previous = Number(card.querySelector(".previous").value);
    const current = Number(card.querySelector(".current").value);

    const consumption = current - previous;

    totalConsumption += consumption;

    shops.push({
      shop_name,
      previous,
      current,
      consumption
    });
  });

  if (totalConsumption <= 0) {
    alert("Invalid consumption values");
    return;
  }

  const rate = totalBill / totalConsumption;

  shops = shops.map(shop => ({
    ...shop,
    bill: (shop.consumption * rate).toFixed(2)
  }));

  latestCalculation = {
    invoice_number: document.getElementById("invoiceNumber").value,
    billing_date: document.getElementById("billingDate").value,
    total_bill: totalBill,
    total_consumption: totalConsumption,
    rate_per_unit: rate.toFixed(2),
    shops
  };

  renderResults(latestCalculation);
});

function renderResults(data) {
  document.getElementById("totalConsumption").innerText = data.total_consumption;
  document.getElementById("ratePerUnit").innerText = `৳ ${data.rate_per_unit}`;

  resultCards.innerHTML = "";

  data.shops.forEach(shop => {
    const div = document.createElement("div");
    div.className = "result-card";

    div.innerHTML = `
      <h3>${shop.shop_name}</h3>
      <p>Consumption: ${shop.consumption} Units</p>
      <p>Bill: ৳ ${shop.bill}</p>
    `;

    resultCards.appendChild(div);
  });
}

saveBtn.addEventListener("click", async () => {
  if (!latestCalculation) {
    alert("Calculate first");
    return;
  }

  const { error } = await supabaseClient
    .from("bill_history")
    .insert([latestCalculation]);

  if (error) {
    alert("Failed to save");
    console.log(error);
  } else {
    alert("Saved Successfully");
    generateInvoiceNumber();
  }
});



if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}
