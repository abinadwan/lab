let score = 0;
let level = 1;
let upgradePurchased = false;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const plantBtn = document.getElementById("plantBtn");

// زراعة بذرة
plantBtn.addEventListener("click", () => {
  score += 1;
  if (upgradePurchased) score += 1; // ترقية تضاعف النقاط
  scoreElement.textContent = score;

  // ترقية تلقائية للمستوى
  if (score >= level * 10 && level < 5) {
    level++;
    levelElement.textContent = level;
    alert(`🎉 تهانًا! ارتقيت إلى المستوى ${level}`);
  }

  // تأثير النقر
  plantBtn.textContent = "زرعت! 🌱";
  setTimeout(() => {
    plantBtn.textContent = "زرع بذرة 🌱";
  }, 300);
});

// شراء ترقية
function buyUpgrade() {
  if (score >= 50 && !upgradePurchased) {
    score -= 50;
    upgradePurchased = true;
    scoreElement.textContent = score;
    alert("✅ اشتريت ترقية: كل نقرة تعطي نقطتين!");
  } else if (upgradePurchased) {
    alert("لقد اشتريت هذه الترقية مسبقًا!");
  } else {
    alert("ليس لديك نقاط كافية!");
  }
}