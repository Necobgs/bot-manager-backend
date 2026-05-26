export function normalize(text:string){
    return text
        .trim()
        .normalize('NFD') // Remove acentos
        .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas
        .toLowerCase() // Converte para minúsculas
        .replace(/\s+/g, '_');
}