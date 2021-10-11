import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export abstract class EntityService {

  constructor(protected firestore: AngularFirestore) { }

  /**
   * Créé une nouvelle entité
   * 
   * @param newEntity : record de la nouvelle entité à créer
   * @param collectionName : nom de la collection sur firebase contenant ce type d'entité
   * @returns {string} l'id de l'entité qui vient d'être créée
   */
  async create<Entity>(newEntity: Entity, collectionName: string) {
    let createdId: string = "";
    await this.firestore.collection(collectionName).add(newEntity).then(response => {
      createdId = response.id;
    });
    return createdId;
  }

  /**
   * Récupère les entités de firebase selon le nom de la collection
   * 
   * @param collectionName : nom de la collection sur firebase contenant ce type d'entité 
   */
  getAll<Entity>(collectionName: string) {
    return this.firestore.collection(collectionName).snapshotChanges();
  }

  /**
   * Récupère un élément dans la collection selon son id
   * 
   * @param id : id de l'élément à récupérer dans la collection
   * @param collectionName : nom de la collection sur firebase contenant ce type d'entité  
   */
  getById<Entity>(id: string, collectionName: string) {
    return this.firestore.doc(collectionName + '/' + id).snapshotChanges();
  }

  /**
   * Met à jour un élément de la collection de firebase
   * 
   * @param id : id de l'ancienne entité à mettre à jour
   * @param newEntity : record de la nouvelle version de l'entité
   * @param collectionName  : nom de la collection sur firebase contenant ce type d'entité 
   */
  update<Entity>(id: string, newEntity: Entity, collectionName: string) {
    return this.firestore.doc(collectionName + '/' + id).update(newEntity);
  }

  /**
   * Supprime un élément de la collection firebase
   * 
   * @param id : id  de l'entité à supprimer
   * @param collectionName  : nom de la collection sur firebase contenant ce type d'entité 
   */
  delete<Entity>(id: string, collectionName: string) {
    return this.firestore.doc(collectionName + '/' + id).delete();
  }
}
