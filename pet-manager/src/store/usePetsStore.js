import { create } from 'zustand';
import { DATABASE_ID, COLLECTION_ID_PETS, database } from '../appwriteConfig';
import { ID, Query } from 'appwrite';


// Zustand store for managing pets
const usePetsStore = create((set) => ({
  pets: [], // State: List of pets
  loading: false,

  // fetch pets from the server
  fetchPets: async (OwnerID) => {
    set({ loading: true });
    try {
      const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_PETS, [Query.equal("OwnerID", OwnerID)]);
      console.log('RESPONSE', response);
      set({ pets: response.documents, loading: false });
    } catch (error) {
      console.error('Error fetching pets:', error);
      set({ loading: false });
    }

  },

  // Action: Add a new pet
  createPet: async (petData, userID) => {
    set({ loading: true });

    try {
      const newPet = { ...petData, OwnerID: userID };

      // create a new document in appwrite
      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PETS,
        ID.unique(),
        newPet 
      );
      console.log('Pet created:', response);

      set((state) => ({
        pets: [...state.pets, response],
        loading: false,
      }));
    } catch (error) {
      console.error('Error creating pet:', error);
      set({ loading: false });
    }
  },

  // Action: Remove a pet by ID
  removePet: async (id) => {
    set({ loading: true });
    try{
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID_PETS, id);
      set((state) => ({
        pets: state.pets.filter((pet) => pet.$id !== id),
        loading: false,
      }));
    }catch(error) {
      console.error('Error removing pet:', error);
      set({ loading: false });
    }
  },
}));


export default usePetsStore;
