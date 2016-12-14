var nivel = [];

function trocarCor(botao){
    switch(parseInt(botao)){
        case 0:
            td = $("td#botaoVerde");
            corNova = "rgb(0, 255, 0)";
            corAntiga = "rgba(0, 255, 0, 0.3)";
            break;
        case 1:
            td = $("td#botaoAmarelo");
            corNova = "rgb(255, 255, 0)";
            corAntiga = "rgba(255, 255, 0, 0.3)";
            break;
        case 2:
            td = $("td#botaoVermelho");
            corNova = "rgb(255, 0, 0)";
            corAntiga = "rgba(255, 0, 0, 0.3)";
            break;
        case 3:
            td = $("td#botaoAzul");
            corNova = "rgb(0, 0, 255)";
            corAntiga = "rgba(0, 0, 255, 0.3)";
    }
    if (td.css("background-color") == corNova)
        td.css("background-color", corAntiga);
    else
        td.css("background-color", corNova);
}

function piscar(botao, callback){
    trocarCor(botao);
    setTimeout(function(){
        trocarCor(botao);
        if(typeof callback == "function") 
            callback();       
    }, 500);    
}

function piscarSequencia(seq, callback){ 
    var sequencia = seq.slice(0);   
    if (sequencia.length)
        piscar(sequencia[0], function(){
            sequencia.shift();
            piscarSequencia(sequencia, callback);
        });
    else if (typeof callback == "function")
        callback();
}

function numeroAleatorio(){
    return Math.floor((Math.random() * 4) + 0);
}

function gerarProximoNivel(callback){
    var proxNivel = nivel.length;
    nivel.push(numeroAleatorio());
    piscarSequencia(nivel, callback);
}

$(document).ready(function(){
    var index = 0,
        liberarClick = false;
    $("td").mouseup(function(){
        if (liberarClick){
            var clique = $(this).attr("data-index");
            trocarCor(clique);
            if (clique == nivel[index]){
                if (index == (nivel.length - 1)){
                    $("h3#situacao").html("Correto! Próximo nível!");
                    $("#btnIniciar").val("Iniciar Nível");
                    $("#btnIniciar").prop("disabled", false);
                    liberarClick = false;
                    return;
                }
                index++;                        
            }
            else{
                $("h3#situacao").html("Você perdeu!");
                $("#btnIniciar").val("Reiniciar");
                $("#btnIniciar").prop("disabled", false);
                nivel = [];
                liberarClick = false;
            }
        }
    }).mousedown(function(){
        if (liberarClick){
            var clique = $(this).attr("data-index");
            trocarCor(clique);
        }
    });

    $("#btnIniciar").click(function(){
        index = 0;
        liberarClick = false;
        $("#btnIniciar").prop("disabled", true);
        $("h3#situacao").text("Preste atenção nas cores!");
        $("h2#nivelAtual").text("Nível Atual: " + (nivel.length + 1)); 
        gerarProximoNivel(function(){
            liberarClick = true;
            $("h3#situacao").text("Sua vez!");
        });
    });
});