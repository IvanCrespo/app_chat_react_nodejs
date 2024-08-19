import { useAuthStore } from "@/store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

export const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<any>(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("El nombre es requerido!");
      return false;
    }
    if (!lastName) {
      toast.error("Los apellidos son requeridos!");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color: selectedColor,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Perfil de usuario actualizado correctamente!");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Porfavor configura tu perfil!");
    }
  };
 
  const handleFileInputClick = () => {
    if(fileInputRef.current !== null){
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async(event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
      const file = event.target.files[0];
      console.log({file});
      if(file){
        const formData = new FormData();
        formData.append("profile-image", file);
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true
        });
        if(response.status === 200 && response.data.image){
          setUserInfo({...userInfo, image: response.data.image})
          toast("Foto de perfil actualizada correctamente!")
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  const handleDeleteImage = async() => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true
      })
      if(response.status === 200){
        setUserInfo({...userInfo, image: null})
        toast.success("Imagen de Perfil se elimino correctamente!");
        setImage(null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl cursor-pointer lg:text-6xl text-white/90" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="relative flex items-center justify-center w-32 h-full md:w-48 md:h-48"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="w-32 h-32 overflow-hidden rounded-full md:w-48 md:h-48">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`w-32 h-32 text-5xl uppercase md:w-48 md:h-48 border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 ring-fuchsia-50" onClick={image ? handleDeleteImage : handleFileInputClick}>
                {image ? (
                  <FaTrash className="text-3xl text-white cursor-pointer" />
                ) : (
                  <FaPlus className="text-3xl text-white cursor-pointer" />
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp"/>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 text-white min-w-32 md:min-w-64">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type=" text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="flex w-full gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/70 outline-4"
                      : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            onClick={saveChanges}
            className="w-full h-16 transition-all duration-300 bg-purple-700 hover:bg-purple-900"
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};
