var nivel = [];

function piscar(botao, callback){
    var td, corNova, corAntiga;
    switch(parseInt(botao)){
        case 0:
            td = $("td#botaoVerde");
            corNova = "green";
            corAntiga = "rgba(0,255,0, 0.3)";
            break;
        case 1:
            td = $("td#botaoAmarelo");
            corNova = "yellow";
            corAntiga = "rgba(255,255,0, 0.3)";
            break;
        case 2:
            td = $("td#botaoVermelho");
            corNova = "red";
            corAntiga = "rgba(255,0,0, 0.3)";
            break;
        case 3:
            td = $("td#botaoAzul");
            corNova = "blue";
            corAntiga = "lightblue";
    }
    td.css("background", corNova);
    setTimeout(function(){
        td.css("background", corAntiga);
        if(typeof callback == "function") 
            callback();       
    }, 500);
}

function piscarSequencia(seq){ 
    var sequencia = seq.slice(0);   
    if (sequencia.length)
        piscar(sequencia[0], function(){
            sequencia.shift();
            piscarSequencia(sequencia);
        });
}

function numeroAleatorio(){
    return Math.floor((Math.random() * 4) + 0);
}

function gerarProximoNivel(){
    var proxNivel = nivel.length;
    nivel.push(numeroAleatorio());
    piscarSequencia(nivel);
}

$(document).ready(function(){
    $("td").click(function(){
        piscar($(this).attr("data-index"));
    });

    $("#btnExecutar").click(function(){
        gerarProximoNivel();
    });
});