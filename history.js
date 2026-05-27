const historyContainer = document.getElementById("historyContainer");
const csvExportBtn = document.getElementById("csvExportBtn");

async function loadHistory() {
  const { data, error } = await supabaseClient
    .from("bill_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    historyContainer.innerHTML = "Failed to load history";
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
          <button class="btn secondary export-pdf-btn">Export PDF</button>
          <button class="btn danger delete-btn">Delete</button>
        </div>
      </div>

      <p>Total Bill: ৳ ${item.total_bill}</p>
      <p>Total Consumption: ${item.total_consumption}</p>
      <p>Rate Per Unit: ৳ ${item.rate_per_unit}</p>

      <div class="shops-list"></div>
    `;

    const shopsList = div.querySelector(".shops-list");

    (item.shops || []).forEach(shop => {
      const shopDiv = document.createElement("div");
      shopDiv.className = "shop-history";

      shopDiv.innerHTML = `
        <h4>${shop.shop_name}</h4>
        <p>Previous: ${shop.previous}</p>
        <p>Current: ${shop.current}</p>
        <p>Consumption: ${shop.consumption}</p>
        <p>Bill: ৳ ${shop.bill}</p>
      `;

      shopsList.appendChild(shopDiv);
    });

    div.querySelector(".delete-btn").addEventListener("click", async () => {
      const confirmed = confirm("Delete this record?");
      if (!confirmed) return;

      await supabaseClient.from("bill_history").delete().eq("id", item.id);
      loadHistory();
    });

    div.querySelector(".export-pdf-btn").addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text("Electricity Bill Report", 20, 20);

      doc.setFontSize(12);
      doc.text(`Invoice: ${item.invoice_number}`, 20, 35);
      doc.text(`Date: ${item.billing_date}`, 20, 45);
      doc.text(`Total Bill: ৳ ${item.total_bill}`, 20, 55);

      let y = 70;
      doc.setFontSize(12);

      doc.text(`Total Consumption: ${item.total_consumption}`, 20, y);
      y += 10;
      doc.text(`Rate Per Unit: ৳ ${item.rate_per_unit}`, 20, y);
      y += 15;
      y += 5;

      (item.shops || []).forEach(shop => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(12);
        doc.text(`${shop.shop_name}`, 20, y);
        doc.text(`Previous: ${shop.previous}`, 30, y + 8);
        doc.text(`Current: ${shop.current}`, 30, y + 16);
        doc.text(`Consumption: ${shop.consumption} Units`, 30, y + 24);
        doc.text(`Bill: ৳ ${shop.bill}`, 30, y + 32);
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
    alert("Failed to load history for CSV export");
    return;
  }

  if (!data || data.length === 0) {
    alert("No history records");
    return;
  }

  let csv =
    "Invoice Number,Billing Date,Total Bill,Total Consumption,Rate Per Unit,Shop,Previous,Current,Consumption,Bill\n";

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

