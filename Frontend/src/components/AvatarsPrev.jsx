import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../../Config/config";
import { Check, X } from "lucide-react"; 

function AvatarsPrev({ currentUser, setAvatars }) {
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ["profile", currentUser],
  });

  const { mutate } = useMutation({
    mutationKey: ["selectAvatar", currentUser],
    mutationFn: async (avatar) => {
      return await config.selectAvatar({ currentUser, avatar });
    },
    onSuccess: (_, avatarId) => {
      const avatars = queryClient.getQueryData(["avatars"]);
      const selectedAvatar = avatars?.data?.find((a) => a._id === avatarId);

      if (selectedAvatar) {
        queryClient.setQueryData(["profile", currentUser], (oldData) => ({
          ...oldData,
          data: {
            ...oldData.data,
            image: selectedAvatar.avatar,
          },
        }));
      }

      queryClient.invalidateQueries(["profile", currentUser]);
      setAvatars(false);
    },
  });

  const { data } = useQuery({
    queryKey: ["avatars"],
    queryFn: async () => {
      return await config.getAvatars();
    },
  });


  const isSelectedAvatar = (avatarUrl) => {
    return profileData?.data?.image === avatarUrl;
  };

  return (
    <div className="bg-white z-50 md:w-90 w-full h-120 absolute top-18 border-2 no-scrollbar left-0 overflow-y-scroll shadow-xl rounded-xl">
      <button
        onClick={() => setAvatars(false)}
        className="absolute top-2 right-2 z-50 bg-gray-200 hover:bg-gray-300 text-gray-800 p-1 rounded-full transition-colors"
        aria-label="Close avatar selection"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-3 gap-x-1 gap-y-4 p-6 pt-10">
        {data?.data?.map((avatar, index) => (
          <div key={index} className="relative">
            <img
              onClick={() => mutate(avatar?._id)}
              className="h-30 w-full object-cover cursor-pointer hover:scale-105 transition-transform rounded-lg"
              src={avatar?.avatar}
              alt="Avatar"
            />
            {isSelectedAvatar(avatar.avatar) && (
              <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvatarsPrev;
