const historyContainer = document.getElementById("historyContainer");
const csvExportBtn = document.getElementById("csvExportBtn");

const { t } = window.EbillI18n || {};

async function loadHistory() {
  const { data, error } = await supabaseClient
    .from("bill_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    historyContainer.innerHTML = t ? t("historyLoadFailed") : "Failed to load history";
    return;
  }

  historyContainer.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-card";

    div.innerHTML = `
    <div class="history-top">
        <div>
          <h2>${item.invoice_number}</h2>
          <p>${item.billing_date}</p>
        </div>

        <div class="history-actions">
          <button class="btn secondary export-pdf-btn">${t ? t("exportPDF") : "Export PDF"}</button>
          <button class="btn danger delete-btn">${t ? t("delete") : "Delete"}</button>
        </div>
      </div>

      <p>${t ? t("totalBillLabel") : "Total Bill"}: ৳ ${item.total_bill}</p>
      <p>${t ? t("totalConsumptionLabel") : "Total Consumption"}: ${item.total_consumption}</p>
      <p>${t ? t("ratePerUnitLabel") : "Rate Per Unit"}: ৳ ${item.rate_per_unit}</p>

      <div class="shops-list"></div>
    `;

    const shopsList = div.querySelector(".shops-list");

    (item.shops || []).forEach(shop => {
      const shopDiv = document.createElement("div");
      shopDiv.className = "shop-history";

      shopDiv.innerHTML = `
        <h4>${shop.shop_name}</h4>
        <p>${t ? t("previousLabel") : "Previous"}: ${shop.previous}</p>
        <p>${t ? t("currentLabel") : "Current"}: ${shop.current}</p>
        <p>${t ? t("consumption") : "Consumption"}: ${shop.consumption} ${t ? t("consumptionUnits") : "Units"}</p>
        <p>${t ? t("billLabel") : "Bill"}: ৳ ${shop.bill}</p>
      `;

      shopsList.appendChild(shopDiv);
    });

    div.querySelector(".delete-btn").addEventListener("click", async () => {
      const confirmed = confirm(t ? t("deleteThisRecord") : "Delete this record?");
      if (!confirmed) return;

      await supabaseClient.from("bill_history").delete().eq("id", item.id);
      loadHistory();
    });

    div.querySelector(".export-pdf-btn").addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text(t ? t("electricityBillReport") : "Electricity Bill Report", 20, 20);

      doc.setFontSize(12);
      doc.text(`${t ? t("invoice") : "Invoice"}: ${item.invoice_number}`, 20, 35);
      doc.text(`${t ? t("date") : "Date"}: ${item.billing_date}`, 20, 45);
      doc.text(`${t ? t("totalBillLabel") : "Total Bill"}: ৳ ${item.total_bill}`, 20, 55);

      let y = 70;
      doc.setFontSize(12);

      doc.text(`${t ? t("totalConsumptionPDF") : "Total Consumption"}: ${item.total_consumption}`, 20, y);
      y += 10;
      doc.text(`${t ? t("ratePerUnitPDF") : "Rate Per Unit"}: ৳ ${item.rate_per_unit}`, 20, y);
      y += 15;

      y += 5;

      (item.shops || []).forEach(shop => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.text(`${shop.shop_name}`, 20, y);
        doc.text(`${t ? t("previousLabel") : "Previous"}: ${shop.previous}`, 30, y + 8);
        doc.text(`${t ? t("currentLabel") : "Current"}: ${shop.current}`, 30, y + 16);
        doc.text(
          `${t ? t("consumption") : "Consumption"}: ${shop.consumption} ${t ? t("consumptionUnits") : "Units"}`,
          30,
          y + 24
        );
        doc.text(`${t ? t("billLabel") : "Bill"}: ৳ ${shop.bill}`, 30, y + 32);
        y += 42;
      });

      doc.save(`${item.invoice_number}.pdf`);
    });

    historyContainer.appendChild(div);
  });
}

csvExportBtn?.addEventListener("click", async () => {
  const { data, error } = await supabaseClient
    .from("bill_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(t ? t("exportCSVFailed") : "Failed to load history for CSV export");
    return;
  }

  if (!data || data.length === 0) {
    alert(t ? t("noHistoryRecords") : "No history records");
    return;
  }

  let csv =
    `${t ? t("csvInvoiceNumber") : "Invoice Number"},${t ? t("csvBillingDate") : "Billing Date"},${t ? t("csvTotalBill") : "Total Bill"},${t ? t("csvTotalConsumption") : "Total Consumption"},${t ? t("csvRatePerUnit") : "Rate Per Unit"},${t ? t("csvShop") : "Shop"},${t ? t("csvPrevious") : "Previous"},${t ? t("csvCurrent") : "Current"},${t ? t("csvConsumption") : "Consumption"},${t ? t("csvBill") : "Bill"}\n`;

  data.forEach(item => {
    (item.shops || []).forEach(shop => {
      const row = [
        item.invoice_number,
        item.billing_date,
        item.total_bill,
        item.total_consumption,
        item.rate_per_unit,
        shop.shop_name,
        shop.previous,
        shop.current,
        shop.consumption,
        shop.bill,
      ].map(v => {
        const s = String(v ?? "");
        return `"${s.replaceAll('"', '""')}"`;
      });

      csv += row.join(",") + "\n";
    });
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "history.csv";
  a.click();
  URL.revokeObjectURL(url);
});

loadHistory();

