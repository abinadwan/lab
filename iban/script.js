// تضمين خط عربي (Amiri) كـ Base64 - مع الهيدر الصحيح
const amiriFontBase64 = `data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAeAAA4AAAAACBAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABWAAAABwAAAAch6L/Z0dERUYAAAF0AAAAHQAAABwAKAAET1MvMgAAAZQAAABJAAAAYLd4QDpjbWFwAAAB1AAAAEUAAAFS1q42g2N2dCAAAAIYAAAABAAAAAQAKAL4Z2FzcAAAAiwAAAAIAAAACP//AANnbHlmAAACMAAAAHUAAACk1Zl/1mhheHAAAACIAAAAHQAAACADuwEfaG1hcAAAAJAAAABIAAAARLcCAABtYXhwAAAAmAAAACAAAAAgAS4B9G5hbWUAAACwAAAA+QAAARO911oUcG9zdAAAASgAAABcAAAAVvqfj1BwcmVwAAABeAAAALgAAAGq72PwVgAAAAEAAAAA8MhiJwAAAACjl6o+AAAAAMFTuJX+c8uIzr0ESuwAAQAAAAAAAAAAAAAAAAAAAIAAAQAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA......`;

let clientAccounts = [];
let prefix = "";
let suffix = "";
let editableLength = 0;
let startPosGlobal = 0;
let endPosGlobal = 0;

// عند تحميل الصفحة
window.addEventListener("load", function () {
  const select = document.getElementById("startPosSelect");
  if (!select) return;

  // ملء القائمة من 3 إلى 20
  for (let i = 3; i <= 20; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = `الخانة ${i}`;
    select.appendChild(option);
  }

  // تحديث الخانة النهائية أول مرة
  updateEndPosition();

  // إضافة مستمع لتغيير القيمة
  select.addEventListener("change", updateEndPosition);
});

// تحديث الخانة النهائية (ابتدائية + 2)
function updateEndPosition() {
  const select = document.getElementById("startPosSelect");
  const display = document.getElementById("endPosDisplay");

  if (!select || !display) return;

  const start = parseInt(select.value);
  const end = start + 2;
  display.value = end;

  // حفظها عالميًا لاستخدامها في addNewClient
  startPosGlobal = start;
  endPosGlobal = end;

  return { start, end };
}

function startGeneration() {
  const baseIban = document.getElementById("baseIban").value.trim().replace(/\s+/g, "");
  const result = updateEndPosition();
  const start = result.start;
  const end = result.end;
  const initialCount = parseInt(document.getElementById("initialCount").value);
  const idPattern = document.getElementById("idPattern").value.trim() || "CUST-{000}";

  // التحقق من IBAN
  if (baseIban.length !== 24) {
    alert("رقم IBAN يجب أن يكون 24 حرفًا بالضبط.");
    return;
  }
  if (!baseIban.startsWith("SA")) {
    alert("يجب أن يبدأ IBAN بـ SA");
    return;
  }

  // التحقق من النطاق
  if (start < 3 || end > 22) {
    alert("نطاق الخانات غير صالح. يجب أن تكون من 3 إلى 20.");
    return;
  }
  if (isNaN(initialCount) || initialCount < 1) {
    alert("الرجاء إدخال عدد صحيح أكبر من 0");
    return;
  }

  const nationalPart = baseIban.substring(2); // 22 رقم
  prefix = nationalPart.substring(0, start - 1); // قبل النطاق
  suffix = nationalPart.substring(end);         // بعد النطاق
  editableLength = end - start + 1;

  // استخراج القيمة الحالية من الخانات المحددة
  const currentSegment = nationalPart.substring(start - 1, end);
  if (currentSegment.length !== editableLength) {
    alert("خطأ في استخراج الجزء. تحقق من IBAN.");
    return;
  }

  let nextValue = parseInt(currentSegment, 10) + 1; // تبدأ من التالي
  const maxValue = Math.pow(10, editableLength);

  if (nextValue + initialCount - 1 >= maxValue) {
    alert(`لا يمكن توليد ${initialCount} حسابات. تجاوز الحد المسموح (${editableLength} أرقام).`);
    return;
  }

  // إعداد العرض
  clientAccounts = [];
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
  const container = document.getElementById("clientsContainer");
  container.innerHTML = "";

  for (let i = 0; i < initialCount; i++) {
    const numStr = (nextValue + i).toString().padStart(editableLength, '0');
    const national = prefix + numStr + suffix;
    const iban = "SA" + national;
    const formattedIban = iban.match(/.{1,4}/g).join(" ");
    const autoId = generateId(clientAccounts.length);

    const item = document.createElement("div");
    item.className = "client-item";
    item.innerHTML = `
      <div><small>${formattedIban}</small></div>
      <input type="text" class="client-name" placeholder="اسم العميل">
      <input type="text" class="amount" placeholder="مبلغ العقار (مثل: ١٠٠٠)">
    `;
    container.appendChild(item);

    clientAccounts.push({
      iban: formattedIban,
      national,
      name: "",
      id: autoId,
      amount: ""
    });
  }
}

function generateId(index) {
  const pattern = document.getElementById("idPattern").value || "CUST-{000}";
  const match = pattern.match(/\{(.+?)\}/);
  if (!match) return `ID-${index}`;
  const format = match[1];
  const len = format.length;
  const startNum = parseInt(format.replace(/\D/g, '')) || 0;
  return pattern.replace(/\{(.+?)\}/, (startNum + index).toString().padStart(len, '0'));
}

function addNewClient() {
  const start = startPosGlobal;
  const end = endPosGlobal;
  const maxValue = Math.pow(10, editableLength);

  if (clientAccounts.length === 0) {
    alert("لا توجد حسابات سابقة لتوليد واحدة جديدة.");
    return;
  }

  // استخراج آخر حساب من national (ليس من iban)
  const lastNational = clientAccounts[clientAccounts.length - 1].national;
  const currentNumStr = lastNational.substring(start - 1, end);
  const currentNum = parseInt(currentNumStr, 10);
  const nextNum = currentNum + 1;

  if (nextNum >= maxValue) {
    alert("تم استهلاك جميع الأرقام الممكنة في هذا النطاق.");
    return;
  }

  const numStr = nextNum.toString().padStart(editableLength, '0');
  const national = prefix + numStr + suffix;
  const iban = "SA" + national;
  const formattedIban = iban.match(/.{1,4}/g).join(" ");
  const autoId = generateId(clientAccounts.length);

  const item = document.createElement("div");
  item.className = "client-item";
  item.innerHTML = `
    <div><small>${formattedIban}</small></div>
    <input type="text" class="client-name" placeholder="اسم العميل">
    <input type="text" class="amount" placeholder="مبلغ العقار (مثل: ١٠٠٠)">
  `;
  document.getElementById("clientsContainer").appendChild(item);

  clientAccounts.push({
    iban: formattedIban,
    national,
    name: "",
    id: autoId,
    amount: ""
  });
}

function finalizeClients() {
  const items = document.querySelectorAll(".client-item");
  const arToEnMap = { '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9' };

  items.forEach((item, i) => {
    const name = item.querySelector(".client-name").value.trim() || "(بدون اسم)";
    let amountInput = item.querySelector(".amount").value.trim();

    // تحويل الأرقام العربية إلى إنجليزية
    if (amountInput) {
      amountInput = amountInput.replace(/[٠-٩]/g, d => arToEnMap[d]);
    }

    // التحقق من أن القيمة رقمية
    let amount = parseFloat(amountInput);
    if (isNaN(amount)) {
      amount = 0;
      console.warn(`مبلغ غير صالح تم إدخاله، تم تعيينه إلى 0`);
    }

    clientAccounts[i].name = name;
    clientAccounts[i].amount = amount.toFixed(2);
  });

  let output = "الحساب\t\t\tالاسم\t\t\tالمعرف\t\tالمبلغ\tالحساب الوطني\n";
  output += "─".repeat(130) + "\n";
  clientAccounts.forEach(acc => {
    output += `${acc.iban}\t${acc.name.padEnd(20)}\t${acc.id.padEnd(15)}\t${acc.amount}\t${acc.national}\n`;
  });

  window.exportData = clientAccounts;
  document.getElementById("results").textContent = output;
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step3").classList.remove("hidden");
}

function copyResults() {
  const text = document.getElementById("results").textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert("تم النسخ إلى الحافظة!"))
    .catch(err => alert("فشل النسخ: " + err));
}

function exportToCSV() {
  const csv = Papa.unparse(window.exportData.map(r => ({
    "رقم الحساب": r.iban,
    "الاسم": r.name,
    "المعرف": r.id,
    "المبلغ": r.amount,
    "الحساب الوطني": r.national
  })), {
    encoding: 'utf-8',
    bom: true // هذا يضمن BOM لدعم العربية
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `تقرير_الحسابات_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;

  jsPDF.API.events.push(['addFonts', function () {
    // تضمين الخط العربي من السلسلة Base64 مباشرة
    this.addFileToVFS('Amiri-Regular.ttf', amiriFontBase64.split(',')[1]);
    this.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
  }]);

  const doc = new jsPDF({ orientation: 'landscape'});
  doc.setFont('Amiri');
  doc.setFontSize(16);
  doc.text("تقرير الحسابات البنكية", 140, 20, { align: "center" });

  const body = window.exportData.map(r => [r.iban, r.name, r.id, r.amount, r.national]);
  doc.autoTable({
    head: [['رقم الحساب', 'الاسم', 'المعرف', 'المبلغ', 'الحساب الوطني']],
    body: body,
    startY: 30,
    styles: { font: 'Amiri', halign: 'right' },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 50 }
    }
  });

  doc.save(`تقرير_الحسابات_${Date.now()}.pdf`);
}
function goToStep1() {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
}

function goToStep2() {
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
}
