import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useRegister = () => {
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async ({ username, email, password, fullname }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, fullname }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.error);
        throw new Error("An error occurred while registering!!");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Account Created successfully");
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Please check all fields and try again!");
    },
  });
  return { register: mutate, isError, errors, isPending };
};
