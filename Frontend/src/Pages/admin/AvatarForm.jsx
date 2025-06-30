import { useState } from "react";
import config from "../../../Config/config";

const AvatarForm = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !avatar) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", avatar);

      const response = await config.addAvatar(formData);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    // console.log("Badge submitted:", { title, description, image });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New avatar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Badge Title */}
        <div>
          <label className="block text-sm font-medium">Avatar Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Badge Image */}
        <div>
          <label className="block text-sm font-medium">avatar Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit avatar
        </button>
      </form>
    </div>
  );
};

export default AvatarForm;
