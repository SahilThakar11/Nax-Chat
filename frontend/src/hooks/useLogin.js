import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export const useLogin = () => {
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.error);
        throw new Error("An error occurred while logging in!!");
      }

      return data;
    },
    onSuccess: () => {
      setErrors({});
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Please check all fields and try again!");
    },
  });

  return { login: mutate, isError, errors, isPending };
};
