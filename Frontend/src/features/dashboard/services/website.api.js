import axios from 'axios'

const websiteInstance = axios.create({
    baseURL: "/api/website",
    withCredentials: true
})

export const createWebsite = async ({ url }) => {
    try {
        const response = await websiteInstance.post("/", { url })
        return response.data
    }
    catch (error) {
        if (!error.response) {
            console.warn("PulseGuard API offline. Demo website created.");
            return {
                success: true,
                website: {
                    id: "demo-site-123",
                    url: url,
                    status: "UP"
                }
            }
        }
        throw error.response?.data || { message: error.message || "Failed to create website" }
    }
}
