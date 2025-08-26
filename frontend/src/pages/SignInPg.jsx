import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export function SignInForm({loginState, setLoginState}) {
    const { register, handleSubmit, formState: { errors }, reset} = useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState(false);

    const signinAPI = async (userData) => {
        const response = await axios.post('http://127.0.0.1:5000/auth/signin', userData);
        console.log("response.data: " + JSON.stringify(response.data))
        return response.data;
    }

    // setting up useMutation with signup api
    const { mutate, isLoading, isError, error, isSuccess } = useMutation({
        mutationFn: signinAPI,
        onSuccess: (data) => { console.log(data.token)
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username',data.username);
            setLoginState(true)
            queryClient.invalidateQueries(['users']);
        },
        onError: () => console.log("Failed to create user", error.cause)
    })

    const handleOnSubmit = (data) => {
        console.log("Sign in data: " + JSON.stringify(data));
        mutate(data)
        console.log("should be false on failed login: ", isSuccess)
        reset();
        loginState ? navigate('/home') : setLoginError(true) ;
    }

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center
            bg-slate-300">
            <form className="bg-white h-80 w-90 rounded-xl py-2"
                onSubmit={handleSubmit(handleOnSubmit)}>
                <header className="flex justify-center text-lg my-2 font-bold p-2">
                    Sign In
                </header>

                <div className="border-2 h-12 mx-6 my-4 rounded-sm">
                    <input type="text" name="email" placeholder="UserName or Email"
                        className="focus:outline-none text-md font-sans h-full w-full px-2 "
                        {...register("email", {
                            required: "Email is a required field.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address."
                            }
                        })}
                    />
                    {errors.email && <p className={`font-sans text-xs font-light text-red-500 flex justify-center`}>{errors.email.message}</p>}
                </div>

                <div className="border-2 h-12 mx-6 my-8 rounded-sm">
                    <input type="password" name="password" placeholder="password"
                        className="focus:outline-none text-md font-sans h-full w-full px-2 "
                        {...register("password", {
                            required: "Password is a required field.",
                            minLength: {
                                value: 6,
                                message: "Password must atleast be of 6 digits."
                            }
                        })}
                    />
                    {errors.password && <p className={`font-sans text-xs font-light text-red-500 flex justify-center`}>{errors.password.message}</p>}
                </div>
                
                {loginError && <p className="font-sans text-xs font-light text-red-500 flex justify-center">Incorrect email or password</p>}

                <div className="flex h-10 justify-center my-4">
                    <button className="border-2 w-22 h-full rounded-lg">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}