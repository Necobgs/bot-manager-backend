import { BaseEntity } from "src/domain/shared/base-entity";



export async function updateListById<T extends BaseEntity>(
    oldListeEntity:T[] | undefined ,
    newListIds:number[],
    findOneById:(id:number) => Promise<T>
) : Promise<T[]> {

    const oldListIds = oldListeEntity ? oldListeEntity.map((entity)=>entity.id) : [] 

    const updatedList : T[] = []

    await Promise.all(
        newListIds.map(async id =>{
            
            // Caso ache um id que a lista já possui, vai apenas buscar a mesma entidade pelo indice
            if(oldListeEntity && oldListIds.includes(id)){ 
                const oldEntity = oldListeEntity.find(oldEntity=> oldEntity.id === id);
                updatedList.push(oldEntity!)
                return;
            };

            const newEntity = await findOneById(id); // Procurar a entidade desejada para adicionar
            updatedList.push(newEntity)

            // Demais entidades da antiga lista serão puladas, pois significa que foram excluidas

        })
    )

    return updatedList;
}