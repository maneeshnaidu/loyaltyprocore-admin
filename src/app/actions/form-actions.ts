"use server"
export const formActions = {
    login: async (formData: FormData) => {

        const email = formData.get("email")
        const password = formData.get("password")

        // Perform login logic here
        console.log("Logging in with:", {
            email,
            password
        });

        return;
    }
}