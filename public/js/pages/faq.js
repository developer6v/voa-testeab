document.addEventListener("DOMContentLoaded", () => {
const questions = document.querySelectorAll(".faq-question");

  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains("active");

      // Fecha todos os outros
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));

      // Abre o atual se não estava aberto
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
});


