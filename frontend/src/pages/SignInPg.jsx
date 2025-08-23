import { useState } from "react";
import { useForm } from "react-hook-form";

export function SignInForm() {
    const { register, handleSubmit, formState: { errors }, reset} = useForm();

    const handleOnSubmit = (data) => {
        console.log("Sign in data: " + JSON.stringify(data));
        reset();
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

                <div className="flex h-10 justify-center my-4">
                    <button className="border-2 w-22 h-full rounded-lg">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}