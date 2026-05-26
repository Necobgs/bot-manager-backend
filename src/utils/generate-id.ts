import { Snowflake } from "nodejs-snowflake";


const uid = new Snowflake();

export function generateId(){

    // SnowFlake gera um id unico como um bigInt baseado na máquina e timestamp e nós usamos convertido para string por

    // 1. Um bigInt não pode ser serializado diretamente no JSON
    //    ex: JSON.stringfy(12341261531234n) irá gerar um erro
    
    //2. Usar string para IDs em diferentes plataformas irá perder o risco de precisão, especialmente por conta de ser um bigInt


    return uid.getUniqueID().toString();
}