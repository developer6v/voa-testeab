document.addEventListener("DOMContentLoaded", () => {
  const botaoFixo = document.getElementById("botao-fixo");
  const rodape = document.querySelector("footer");
  const pricing = document.querySelector("#pricing");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const rodapeTop = rodape.offsetTop;

    const pricingRect = pricing.getBoundingClientRect();
    const pricingTop = pricingRect.top;
    const pricingBottom = pricingRect.bottom;

    const isPricingVisible = pricingTop < windowHeight && pricingBottom > 0;

    // Exibe se passou de 200px, não chegou no rodapé e NÃO está na seção #pricing
    if (scrollY > 200 && scrollY + windowHeight < rodapeTop && !isPricingVisible) {
      botaoFixo.classList.add("show");
    } else {
      botaoFixo.classList.remove("show");
    }
  });
});
