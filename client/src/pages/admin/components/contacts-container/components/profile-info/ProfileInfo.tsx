import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import {IoPowerSharp} from 'react-icons/io5'
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

export const ProfileInfo = () => {
    const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuthStore();

  const logOut = async() => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true});
      if(response.status === 200){
        navigate("/auth")
        setUserInfo(null)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex items-center justify-center gap-3">
        <div className="relative w-12 h-12">
          <Avatar className="w-12 h-12 overflow-hidden rounded-full">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`w-12 h-12 text-lg uppercase border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <FiEdit2 className="text-xl font-medium text-purple-500" onClick={() => navigate("/profile")}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Editar Perfil
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <IoPowerSharp className="text-xl font-medium text-red-500" onClick={logOut}/>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
