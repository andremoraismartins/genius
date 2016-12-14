var db;
//Banco de dados
function openConn(){
    db = openDatabase("genius", "1.0", "Jogo Genius", 200000);
    if(!db){
        console.log("Não foi possível conectar ao banco de dados!");
        return false;
    }
    createTable();
    return true;
}
function execute(sql, params, sucesso){
    if (!db)
        return null;
    else
        db.transaction(function(transaction){
            transaction.executeSql(sql, params, sucesso, alertarErros);
        });
}
function createTable(){
    //Codigo INTEGER PRIMARY KEY AUTOINCREMENT
    db.transaction(function(transaction){
        transaction.executeSql("SELECT * FROM Rank", [], null, function () { 
            transaction.executeSql("CREATE TABLE Rank (Nivel INTEGER, Data)", [], null, function (transaction, result) {  
                console.log("Não foi possível criar a tabela no banco de dados! " + result.message);
            });
         });
    });   
}        
function alertarErros(transaction, result){
    alert("Ocorreu um erro no banco de dados!");
    console.log(result);
}