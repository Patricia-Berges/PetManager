import React, { useState } from "react";
import usePetsStore from "../store/usePetsStore";
import { useAuth } from "../store/AuthContext";

import { toast, Flip } from "react-toastify";

const AddPetModal = ({ closeModal }) => {
  const { createPet } = usePetsStore();
  const { user } = useAuth();
  const [petData, setPetData] = useState({ Name: "", Type: "", Pet_Image: "" });
  const [selectedFile, setSelectedFile] = useState(null)
  
  const handleInputChange = (e) => {
    setPetData({ ...petData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file for later use
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPet(petData, user.$id, selectedFile);
    setPetData({ Name: "", Type: "", Pet_Image: "" });
    toast.success("Pet added!", {position:'top-center', theme:'colored', closeOnClick: true, transition: Flip, hideProgressBar: true, autoClose: 2000});
    closeModal();
  };

  const closeModalBgClick = (e) => {
    if (e.target.id === "modal-bg") {
      closeModal();
    }
  };

  

  return (
    <div id="modal-bg" className="fixed inset-0 min-h-screen bg-zinc-700/50 flex justify-center items-center" onClick={closeModalBgClick}>
      <div className="bg-gray-50 p-4 m-4 rounded-lg w-10/12 max-w-screen-md md:w-7/12 shadow-2xl relative">
        <a onClick={closeModal} className="absolute right-5 text-2xl hover:cursor-pointer">X</a>
        <h1 className="text-4xl py-8 font-bold text-center">Add a new pet!</h1>
        <div className="bg-orange-400 w-4/6 h-1 mx-auto mb-8"></div>
        <form className="px-4 my-3 max-w-3xl mx-auto space-y-3 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
          <label htmlFor="Type">What kind of pet?</label>
          <select
            name="Type"
            value={petData.Type}
            onChange={handleInputChange}
            required
            className="m-4 p-2 border-2 border-gray-300 rounded-md w-1/2"
          >
            <option value="">Select Type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
          </select>
          <label htmlFor="Name">Name of your pet:</label>
          <input
            className="border border-gray-400 block py-2 px-4 w-xl rounded focus:outline-none focus:border-teal-500"
            type="text"
            name="Name"
            placeholder="Pet Name"
            value={petData.Name}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="Pet_Image">Image of your pet:</label>
          <input
            type="file"
            id="uploader"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button className="bg-green-500 w-1/4 text-lg rounded p-2 hover:cursor-cell" type="submit">
            Add Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;