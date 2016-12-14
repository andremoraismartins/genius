var nivel = [],
    tempoPiscar = 300,
    tempoIntervalo = 125;

function mostrarRecorde(nivel, data, callback){
    $("#recorde").text("Recorde atual: ");
    if (nivel && data)
        $("#recorde").text("Recorde: Nível " + nivel + " (" + data.toDateString() + ")");
    else if (db)
        execute("SELECT Nivel, Data FROM Rank", null, 
            function(transaction, result){
                with(result)
                    if (rows.length == 1){
                        var dataBanco = new Date(rows[0]["Data"]);
                        $("#recorde").text("Recorde: Nível " + rows[0]["Nivel"] + " (" + dataBanco.toDateString() + ")");
                        if (typeof callback == "function")
                            callback(nivel, dataBanco);
                    }
            }
        );
}

function atualizarRecorde(callback){
    var nivelAtual = nivel.length - 1,
        dataAtual = new Date();
    if (db && nivelAtual >= 1)
        execute("SELECT rowid, Nivel FROM Rank", null, 
            function(transaction, result){
                with(result)
                    if (rows.length == 1){
                        if (nivelAtual > rows[0]["Nivel"]){
                            execute("UPDATE Rank SET Nivel = ?, Data = ? WHERE rowid = ?", [nivelAtual, dataAtual, rows[0]["rowid"]], callback(nivelAtual, dataAtual));
                        }
                    }
                    else
                        execute("INSERT INTO Rank (Nivel, Data) VALUES (?, ?)", [nivelAtual, dataAtual], callback(nivelAtual, dataAtual));
            });
    else
        console.log("Conexão com o banco não está aberta ou o nível atual é 0!");
}

function reiniciar(){
    nivel = [];
    $("#btnIniciar").attr("data-operacao", "0");
    reiniciarBotoes();
}

function reiniciarBotoes(){
    $("td#botaoVerde").css("background-color", "rgba(0, 255, 0, 0.3)");
    $("td#botaoAmarelo").css("background-color", "rgba(255, 255, 0, 0.3)");
    $("td#botaoVermelho").css("background-color", "rgba(255, 0, 0, 0.3)");
    $("td#botaoAzul").css("background-color", "rgba(0, 0, 255, 0.3)");
}

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
            setTimeout(function() {
                callback();
            }, tempoIntervalo);       
    }, tempoPiscar);
}

function piscarSequencia(seq, callback){ 
    var sequencia = seq.slice(0);   
    if (sequencia.length)
        piscar(sequencia.shift(), function(){
            // sequencia.shift();
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
    var index = 0, //Índice que será usado no vetor nível para comparar a cor clicada pelo usuário com o a sequencia gerada  
        liberarClick = false; //True para liberar o clique nos botões das cores e False para bloquear
    
    openConn(); //Abrir conexão com o banco de dados
    mostrarRecorde(); //Mostrar o recorde atual, buscando no banco
    reiniciarBotoes(); //Colocar os botões nas cores padrão

    $("td").mouseup(function(){
        if (liberarClick){
            var clique = $(this).attr("data-index"); //Qual botão foi clicado
            trocarCor(clique);
            if (clique == nivel[index]){ //Se ele acertou a cor
                if (index == (nivel.length - 1)){ //É o fim da sequencia gerada?
                    $("h3#situacao").html("Correto! Próximo nível!");
                    $("#btnIniciar").val("Iniciar Nível");
                    $("#btnIniciar").prop("disabled", false);
                    liberarClick = false;
                    return;
                }
                index++;                        
            }
            else{ //Se ele errou a cor
                $("h3#situacao").html("Você perdeu!");
                $("#btnIniciar").val("Reiniciar");
                $("#btnIniciar").prop("disabled", false);
                atualizarRecorde(function(nivelAtual, dataAtual){
                    alert("Parabéns! Você estabeleceu um novo recorde: Nível " + nivelAtual + "!");
                    mostrarRecorde(nivelAtual, dataAtual);
                });
                liberarClick = false;
                $("#btnIniciar").attr("data-operacao", "1");
            }
            reiniciarBotoes();
        }
    }).mousedown(function(){
        if (liberarClick){
            var clique = $(this).attr("data-index");
            trocarCor(clique);
        }
    });

    $("#btnIniciar").click(function(){
        if ($(this).attr("data-operacao") == "1"){ //Se o botão for de reínicio, deve atualizar o recorde
            reiniciar();
        }
        index = 0;
        liberarClick = false; //Bloqueia todos os botões

        //Atualiza cabeçalho
        $("#btnIniciar").prop("disabled", true);
        $("h3#situacao").text("Preste atenção nas cores!");
        $("h2#nivelAtual").text("Nível Atual: " + (nivel.length + 1));

        gerarProximoNivel(function(){ //Quando piscar toda a sequencia
            liberarClick = true;
            $("h3#situacao").text("Sua vez!");
        });
    });
});