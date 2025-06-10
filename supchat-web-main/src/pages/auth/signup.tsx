import { useEffect, useState } from "react";
import camera from "../../assets/icons/camera.png";
import { uploadToCloudinary } from "../../../script/cloudinaryUpload";
import { toast } from "react-toastify";
import { useSignupMutation } from "../../redux/apis/auth";
import { routes } from "../../constants/variables";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const SignUp = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [imageFile, setIMageFile] = useState("");
  const navigate = useNavigate();
  const [signup, { isLoading, error, isError, isSuccess }] =
    useSignupMutation();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setIMageFile(file);
    }
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (form.password !== form.confirmPassword) {
      toast("Passwords do not match");
      return;
    }
    if (imageFile === "") {
      toast("please select the profle image");
      return;
    }

    const profileURL = await uploadToCloudinary(imageFile);

    if (profileURL === null) {
      toast("error occure uplaoding image");
      return;
    }
    signup({
      name: form.name,
      email: form.email,
      password: form.password,
      profilePicture: profileURL,
    });

    console.log(form, profileURL);
    // Add your sign-up logic here
  };

  useEffect(() => {
    if (isError) {
      toast(error?.data?.message);
    }
    if (isSuccess) {
      toast("Sign up Successfully");
      navigate(routes.login);
    }
  }, [isError, isSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-[var(--color-appWhite)] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--color-primary)]">
          Sign Up
        </h2>
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Label to trigger file input */}
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="rounded-[50px] h-20 w-20 bg-gray-400 flex items-center justify-center overflow-hidden">
              {selectedImage === "" ? (
                <FaCamera />
              ) : (
                <img
                  src={selectedImage}
                  className={`${selectedImage ? "h-20 w-20" : "h-10 w-10"} `}
                  alt="camera icon"
                />
              )}
            </div>
          </label>

          {/* Hidden file input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? "bg-gray-300" : "bg-[var(--color-primary)]"
            } text-white py-2 rounded-lg hover:bg-blue-600 transition`}
          >
            {isLoading ? "Signing up ...." : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={() => navigate(routes.login)}
            disabled={isLoading}
            className={`w-full bg-[var(--color-primary)]
             text-white py-2 rounded-lg hover:bg-blue-600 transition`}
          >
            {"Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
