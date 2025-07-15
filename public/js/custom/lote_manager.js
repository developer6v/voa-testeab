jQuery(document).ready(function ($) {
    var loteValor = $(".lote_valor");
    var loteNum = $(".lote_number");
    var progress_bar = $(".progress_bar");
    var progress_percent = $(".lote_percent");

    $.ajax({
        url: "/voa/src/Controllers/lote.php",
        method: "GET",
        success: function (response) {
            console.log(response);
            var dataLote = JSON.parse(response);
            var valor = dataLote["value"];
            var porcentagem = dataLote["porcentagem"];
            var num = dataLote["lote"];
            var url = dataLote["url"];
            

            loteValor.text(valor);
            loteNum.text(num);
            progress_percent.text(parseInt(porcentagem) + "%");
            progress_bar.css("width", porcentagem+"%");
            $(".urlCheckout").attr("data-url", url);

            $(".progress_lote").css("display", "block");
        },
        error: function (error) {
            console.log("Erro ao atualizar lote", error);
        }
    })
    
});