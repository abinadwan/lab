// --- تحميل البيانات المحفوظة ---
let score = parseInt(localStorage.getItem("farmScore")) || 0;
let level = parseInt(localStorage.getItem("farmLevel")) || 1;

// --- ربط العناصر ---
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const plantBtn = document.getElementById("plantBtn");
const plantImg = document.getElementById("plant");
const clickSound = document.getElementById("clickSound");

// --- تحديث العرض عند التحميل ---
scoreElement.textContent = score;
levelElement.textContent = level;

// --- مسارات صور مراحل النمو ---
const plantStages = [
  "plant1.png",  // المستوى 1: بذرة
  "plant2.png",  // المستوى 2: نبات بأوراق
  "plant3.png",  // المستوى 3: نبات مع زهرة
  "plant4.png"   // المستوى 4: نبات ناضج بالطماطم
];

// --- دالة لتحديث صورة النبات ---
function updatePlantImage() {
  const stageIndex = Math.min(level - 1, 3); // من 0 إلى 3
  plantImg.src = plantStages[stageIndex];
  plantImg.style.opacity = 0.4;
  setTimeout(() => {
    plantImg.style.opacity = 1;
  }, 300);
}

// --- استدعاء الدالة عند التحميل ---
updatePlantImage();

// --- دالة لحفظ التقدم ---
function saveGame() {
  localStorage.setItem("farmScore", score);
  localStorage.setItem("farmLevel", level);
}

// --- حدث النقر على الزر ---
plantBtn.addEventListener("click", () => {
  // تشغيل الصوت
  clickSound.currentTime = 0;
  clickSound.play();

  // إضافة النقاط
  score += 1;
  scoreElement.textContent = score;

  // تأثير النمو
  plantImg.classList.add("grow");
  setTimeout(() => {
    plantImg.classList.remove("grow");
  }, 200);

  // الترقية إلى المستوى التالي
  const oldLevel = level;
  if (score >= level * 10 && level < 4) {
    level++;
    levelElement.textContent = level;
    updatePlantImage(); // تغيير الصورة
    alert(`🎉 تهانًا! نباتك تطور إلى المرحلة ${level}!`);
  } else if (level === 4 && oldLevel === level && score % 10 === 0) {
    // تأثير بسيط عند الاستمرار بعد المستوى 4
    plantImg.style.transform = "scale(1.08)";
    setTimeout(() => {
      plantImg.style.transform = "scale(1)";
    }, 300);
  }

  // حفظ التقدم
  saveGame();
});

// --- دالة إعادة التقدم (البدء من جديد) ---
function resetProgress() {
  if (confirm("هل أنت متأكد أنك تريد البدء من جديد؟")) {
    // مسح البيانات من localStorage
    localStorage.removeItem("farmScore");
    localStorage.removeItem("farmLevel");

    // إعادة تعيين المتغيرات
    score = 0;
    level = 1;
    scoreElement.textContent = score;
    levelElement.textContent = level;

    // إعادة صورة النبات إلى البذرة
    updatePlantImage();

    alert("🌱 تم مسح التقدم. ابدأ من جديد!");
  }
}

// --- رسالة ترحيب عند أول دخول ---
if (!localStorage.getItem("farmScore")) {
  alert("🌱 مرحباً في مزرعتك! انقر لزراعة البذرة وشاهد نباتك ينمو مع كل نقرة!");
}
