import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation } from "../redux/apis/auth";
import { uploadToCloudinary } from "../../script/cloudinaryUpload";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/user";
import { toast } from "react-toastify";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: modalProps) => {
  const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();
  const user = useSelector((state) => state?.user?.user);
  const [name, setName] = useState<string>(user?.name);
  const [imageFile, setIMageFile] = useState("");
  const [isLoading2, setIsLoading2] = useState(false);
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(
    user?.profilePicture || "https://i.pravatar.cc/40"
  );

  const fileInputRef = useRef(null);

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Picked file:", file);
      setIMageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      // You can upload or preview it here
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click(); // trigger the hidden input
  };

  const saveUpdatedInfo = async () => {
    try {
      setIsLoading2(true);
      const profileURL = await uploadToCloudinary(imageFile);
      const response = await updateUser({
        profilePicture: imageFile === "" ? user?.profilePicture : profileURL,
        name: name,
      }).unwrap();
      dispatch(
        setUser({
          name: response?.data?.user?.name,
          profilePicture: response?.data?.user?.profilePicture,
          id: user?.id,
          email: user?.email,
          token: user?.token,
        })
      );
      onClose();
      setIsLoading2(false);
      toast("Updated");
    } catch (e) {
      setIsLoading2(false);

      console.log("error occured ", e);
    }
  };

  useEffect(() => {
    if (isError) {
      toast("Error occured updating profile");
    }
  }, [isError]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay z-150">
      <div className="modal-content flex flex-col gap-2 w-[350px] items-center">
        <div className="w-20 h-20 rounded-[50px] overflow-hidden relative">
          <img src={previewImage} />
        </div>
        <button
          type="button"
          onClick={() => {
            openGallery();
          }}
          className="px-4 sm:px-6 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
        >
          Edit Picture
        </button>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImagePick}
          className="hidden"
        />
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="Enter name"
          required
        />
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={user?.email}
          // onChange={(e) => {}}
          placeholder="Enter email"
          required
        />
        <button
          type="button"
          onClick={() => {
            saveUpdatedInfo();
          }}
          className={`px-4 sm:px-6  ${
            isLoading || isLoading2 ? "bg-gray-300" : "bg-primary"
          } text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm w-full`}
        >
          {isLoading || isLoading2 ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
          }}
          className="px-4 sm:px-6 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
