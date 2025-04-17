import UnderMaintenance from "@/components/under-maintenance";
import axios from "axios";
import { toast } from "sonner";

export const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        // Handle Axios errors
        const err = error.response;
        if (err === undefined || err === null) {
            toast.error("Server is unreachable. Please try again later.");
            return <UnderMaintenance />;
        }

        // Handle authentication failure
        if (err?.status === 401) {
            toast.warning("Authentication failed. Redirecting to login...");
            window.history.pushState({}, "LoginPage", "/login");
            return;
        }
    }
};