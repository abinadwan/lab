// --- تحميل البيانات المحفوظة من localStorage ---
let score = parseInt(localStorage.getItem("farmScore")) || 0;
let level = parseInt(localStorage.getItem("farmLevel")) || 1;
let upgradePurchased = localStorage.getItem("farmUpgrade") === "true";

// --- ربط العناصر ---
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const plantBtn = document.getElementById("plantBtn");
const plantImg = document.getElementById("plant");
const clickSound = document.getElementById("clickSound");

// --- عرض البيانات عند التحميل ---
scoreElement.textContent = score;
levelElement.textContent = level;

// --- تحديث الحفظ بعد أي تغيير ---
function saveGame() {
  localStorage.setItem("farmScore", score);
  localStorage.setItem("farmLevel", level);
  localStorage.setItem("farmUpgrade", upgradePurchased);
}

// --- حدث النقر على الزر ---
plantBtn.addEventListener("click", () => {
  // تشغيل الصوت
  clickSound.currentTime = 0;
  clickSound.play();

  // إضافة النقاط
  score += 1;
  if (upgradePurchased) score += 1; // الترقية تعطي نقطة إضافية
  scoreElement.textContent = score;

  // تأثير النمو
  plantImg.classList.add("grow");
  setTimeout(() => {
    plantImg.classList.remove("grow");
  }, 200);

  // ترقية المستوى
  if (score >= level * 10 && level < 10) {
    level++;
    levelElement.textContent = level;
    alert(`🎉 تهانًا! ارتقيت إلى المستوى ${level}`);
  }

  // حفظ التقدم فورًا
  saveGame();
});

// --- شراء ترقية ---
function buyUpgrade() {
  if (score >= 50 && !upgradePurchased) {
    score -= 50;
    upgradePurchased = true;
    scoreElement.textContent = score;
    alert("✅ اشتريت ترقية: كل نقرة تعطي نقطتين!");
    saveGame(); // حفظ بعد الشراء
  } else if (upgradePurchased) {
    alert("لقد اشتريت هذه الترقية مسبقًا!");
  } else {
    alert("ليس لديك نقاط كافية!");
  }
}

// --- (اختياري) رسالة ترحيب عند أول دخول ---
if (!localStorage.getItem("farmScore")) {
  alert("🌱 مرحباً في مزرعتك! ابدأ بالزرع واجمع النقاط.");
}
