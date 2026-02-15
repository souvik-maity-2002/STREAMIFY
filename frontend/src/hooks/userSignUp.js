import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";

const useSignUp = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
        toast.success("Account created successfully 🎉");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: () => {
        toast.error("Signup failed");
        }
    });

    return { isPending, error, signupMutation: mutate };
    };

export default useSignUp;
