import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTES,
} from "@/utils/constants";
import { useContactStore } from "@/store/contacts/useContactStore";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";

export const CreateChannel = () => {
  const { setSelectedChatData, setSelectedChatType, addChannel } =
    useContactStore();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState<any>([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, {
      withCredentials: true,
    });
    setAllContacts(response.data.contacts);
  };

  const createChannel = async () => {
    try {
      if ((channelName.length > 0 && selectedContacts.length > 0)) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact: any) => contact.value),
          },
          {
            withCredentials: true,
          }
        );
        if(response.status === 201){
            setChannelName("");
            setSelectedContacts([]);
            setNewChannelModal(false);
            addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-light transition-all duration-300 cursor-pointer text-neutral-500 text-opacity-90 text-start hover:text-neutral-100"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Crear Nuevo Canal
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#1c1d25] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              Por favor ingrese la información correspondiente para el nuevo
              canal
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Nombre del Canal"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Buscar Contactos"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-lg leading-10 text-center text-gray-600">
                  No se encontraron resultados
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full transition-all duration-300 bg-purple-700 hover:bg-purple-900"
              onClick={createChannel}
            >
              Crear Canal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
