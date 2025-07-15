
document.addEventListener("DOMContentLoaded", () => {

        
    const botoes = document.querySelectorAll(".garantirparticipacaoopenform");
    const fechar = document.getElementById("fecharPopup");
    const overlay = document.getElementById("popupOverlay");

    // Adiciona evento de clique para todos os botões com a classe garantirparticipacao
    botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        overlay.style.display = "flex";
    });
    });

    // Evento para fechar o popup
    fechar.addEventListener("click", () => {
    overlay.style.display = "none";
    });

    // Fecha o popup ao clicar fora
    overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
    });



});
