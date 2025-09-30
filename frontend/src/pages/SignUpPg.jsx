import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // axios data fetcher
    const newUserAPI = async (userData) => {
        const response = await axios.post('http://127.0.0.1:5000/auth/signup', userData);
        return response.data;
    }

    // setting up useMutation with signup api
    const { mutate, isLoading, isError, error, isSuccess } = useMutation({
        mutationFn: newUserAPI,
        onSucces: () => {
            navigate('/signin');
            queryClient.invalidateQueries(['users']);

        },

        onError: () => console.log("Failed to create user", error)
    })

    const handleOnSubmit = (data) => {
        console.log("sign up data: ", JSON.stringify(data));
        mutate(data);
        reset();
        
    }

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center
             bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-gray-800 dark:to-gray-700">
            <form onSubmit={handleSubmit(handleOnSubmit)}
                className={`bg-white ${errors ? 'h-120' : 'h-110'} w-100 rounded-xl py-2`}>
                <header className="flex justify-center text-lg my-2 font-bold p-2">
                    Sign Up
                </header>
                <div className="mx-2 my-4">
                    <div className="flex justify-between items-center ">
                        <div className="border-red-400 border-2 py-0.5 my-2 ml-4 h-10 w-40 rounded-sm">
                            <input type="text" name="firstName" className=" focus:outline-none text-md font-sans h-full w-full px-2"
                                placeholder="First name" {...register("firstName", {
                                    required: "First name is required",
                                    pattern: {
                                        value: /^[a-zA-Z]+$/,
                                        message: "Numbers and special character not allowed."
                                    }
                                })}
                            />
                            {errors.firstName && <p className={`fonst-sans text-xs font-light text-red-500 mt-2 ${!errors.lastName ? 'mr-55' : null} ml-6`}>{errors.firstName.message}</p>}
                        </div>

                        <div className="border-blue-400 border-2 py-0.5 my-2 mr-4 h-10 w-40 rounded-sm">
                            <input type="text" name="lastName" className=" focus:outline-none text-md font-sans h-full w-full px-2"
                                placeholder="Last name" {...register("lastName", {
                                    required: "Last name is required",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/,
                                        message: "Numbers and special character not allowed."
                                    }
                                })}
                            />
                            {errors.lastName && <p className={`fonst-sans text-xs font-light text-red-500 mt-2 ${!errors.firstName ? 'ml-55' : null} mr-6`}>{errors.lastName.message}</p>}
                        </div>
                    </div>
                </div>


                <div className="border-2 h-12 mx-6 my-6 rounded-sm">
                    <input type="text" placeholder="UserName" name="username"
                        className="focus:outline-none text-md font-sans h-full w-full px-2 "
                        {...register("userName", {
                            required: "User name is required field."
                        })}
                    />
                    {errors.userName && <p className={`fonst-sans text-xs font-light text-red-500 flex justify-center`}>{errors.userName.message}</p>}
                </div>

                <div className="border-2 h-12 mx-6 my-6 rounded-sm">
                    <input type="email" name="email" className="focus:outline-none text-md font-sans h-full w-full px-2 "
                        placeholder="email" {...register("email", {
                            required: "Email is a required field.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address."
                            }
                        })}
                    />
                    {errors.email && <p className={`fonst-sans text-xs font-light text-red-500 flex justify-center`}>{errors.email.message}</p>}
                </div>

                <div className="border-2 h-12 mx-6 my-6 rounded-sm">
                    <input type="password" placeholder="Password" name="password"
                        className="focus:outline-none text-md font-sans h-full w-full px-2 "
                        {...register("password", {
                            required: "Password is a required field.",
                            minLength: {
                                value: 6,
                                message: "Password must atleast be of 6 digits."
                            }
                        })}
                    />
                    {errors.password && <p className={`fonst-sans text-xs font-light text-red-500 flex justify-center`}>{errors.password.message}</p>}
                </div>

                <div className="flex justify-between h-10 items-center my-2">
                    <button type="submit" className="border-4 w-22 h-full rounded-lg ml-20" disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Submit'}
                    </button>
                    <button className="border-4 w-22 h-full rounded-lg mr-20">
                        Close
                    </button>


                </div>
                <div className="flex flex-col justify-between items-center">
                    {isError && <div className={`fonst-sans text-xs font-light  text-red-500`}> Error: {error.message}</div>}
                    {isSuccess && <div className="fonst-sans text-xs font-light text-green-500 ">User Creation successful</div>}
                </div>
            </form>
        </div>
    )
}