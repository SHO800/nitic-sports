import SignIn from "@/components/auth/sign-in";
import SignOut from "@/components/auth/sign-out";

const LoginPage = () => {
    return (
        <div className={"h-[calc(100vh-213px)] w-[calc(100vw-15px)] flex flex-col items-center justify-center space-y-2"}>
            <div>
                
            </div>
            <SignIn />
            <SignOut />
        </div>
    )
}

export default  LoginPage
