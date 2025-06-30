import { useMutation, useQuery } from "@tanstack/react-query";
import config from "../../Config/config";

function AvatarsPrev({ currentUser }) {
  const { mutate } = useMutation({
    mutationKey: ["selectAvatar", currentUser],
    mutationFn: async (avatar) => {
      // console.log("selecting:", avatar);
      return await config.selectAvatar({currentUser, avatar})
    },
  });

  const { data } = useQuery({
    queryKey: ["avatars"],
    queryFn: async () => {
      return await config.getAvatars();
    },
  });

  return (
    <div className="bg-white w-100 h-120 absolute top-55 left-70 overflow-y-scroll grid grid-cols-3 gap-x-1 gap-y-4 shadow-xl p-2 rounded-xl">
      {data?.data?.map((avatar, index) => (
        <img
          onClick={() => mutate(avatar?._id)}
          key={index}
          className="h-30"
          src={avatar?.avatar}
          alt=""
        />
      ))}
    </div>
  );
}

export default AvatarsPrev;
