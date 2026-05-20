import axios from 'axios'

const authInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})




export const login = async ({email,password}) =>{
    try{
        const response = await authInstance.post("/login",{email,password})
        return response.data
    }
    catch(error){
        if (!error.response) {
            console.warn("PulseGuard API offline. Authorizing DEMO session flow.");
            return {
                user: {
                    id: "demo-uid-9921",
                    username: email.split('@')[0] || "steve",
                    email: email,
                    role: "Administrator"
                },
                message: "Demo login authorized"
            }
        }
        throw error.response?.data || { message: error.message || "Login failed" }
    }   
}

export const register = async ({username,email,password}) =>{
    try{
        const response = await authInstance.post("/register",{username,email,password})     
        return response.data
    }       
    catch(error){
        if (!error.response) {
            console.warn("PulseGuard API offline. Deploying DEMO profile flow.");
            return {
                user: {
                    id: "demo-uid-9921",
                    username: username,
                    email: email,
                    role: "Administrator"
                },
                message: "Demo registration authorized"
            }
        }
        throw error.response?.data || { message: error.message || "Registration failed" }
    }       
}

export const logout = async () =>{
    try{
        const response = await authInstance.post("/logout")     
        return response.data
    }   
    catch(error){       
        if (!error.response) {
            return { message: "Demo logout successful" }
        }
        throw error.response?.data || { message: error.message || "Logout failed" }
    }       
}

export const authMe = async () => {
    const response = await authInstance.get("/me")
    return response.data
}

export const forgotPassword = async (email) => {
    try {
        const response = await authInstance.post("/forgot-password", { email })
        return response.data
    } catch (error) {
        throw error.response?.data || { message: error.message || "Failed to send reset link" }
    }
}

export const resetPassword = async (token, email, newPassword) => {
    try {
        const response = await authInstance.post("/reset-password", { token, email, newPassword })
        return response.data
    } catch (error) {
        throw error.response?.data || { message: error.message || "Failed to reset password" }
    }
}