import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/users.service";

export const useUser = (userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("userId is required");
      return usersService.getById(userId);
    },
    enabled: !!userId,
    staleTime: 0,
  });

  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: ["user", userId] });
  };

  return {
    ...query,
    invalidateUser,
  };
};
