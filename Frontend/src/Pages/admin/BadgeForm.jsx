import React, { useState } from "react";
import {useMutation} from '@tanstack/react-query'
import config from "../../../Config/config";

const BadgeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [score, setScore] = useState(null)

  

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      alert("Please fill in all fields");
      return;
    }
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("score", score)
        formData.append("image", image);
        
        const response = await config.addBadge(formData);
        console.log(response)
    } catch (error) {
        console.log(error)
    }
    


    // console.log("Badge submitted:", { title, description, image });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Badge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Badge Title */}
        <div>
          <label className="block text-sm font-medium">Badge Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Badge Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">badge score</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>

        {/* Badge Image */}
        <div>
          <label className="block text-sm font-medium">Badge Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Badge
        </button>
      </form>
    </div>
  );
};

export default BadgeForm;
