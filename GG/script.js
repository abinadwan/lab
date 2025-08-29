let score = 0;
let level = 1;
let upgradePurchased = false;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const plantBtn = document.getElementById("plantBtn");
const plantImg = document.getElementById("plant");
const clickSound = document.getElementById("clickSound");

// تشغيل صوت عند النقر
plantBtn.addEventListener("click", () => {
  clickSound.currentTime = 0; // إعادة الصوت من البداية
  clickSound.play();

  score += 1;
  if (upgradePurchased) score += 1;
  scoreElement.textContent = score;

  // تأثير نمو النبات
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
