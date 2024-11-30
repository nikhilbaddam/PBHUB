import { createContext, useState,useEffect } from "react";
import axios from "axios";

export const StoreContext=createContext(null)
const StoreContextProvider=(props)=>
{

    const url="https://pbhub-backend.onrender.com";
    //https://pbhub-backend.onrender.com
    //http://localhost:3000

    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null); // Store user details here


    // Fetch user details when token is set
    useEffect(() => {
        if (token) {
            // Add the token to authorization headers for authenticated requests
            axios.get(`${url}/users/getuser`, {
                headers: {  token }
            })
            .then((response) => {
                setUser(response.data); // Store user details in context
            })
            .catch((error) => {
                console.error("Failed to fetch user details:", error);
                setToken(""); // Reset token if there's an error
                setUser(null);
            });
        } else {
            setUser(null); // Reset user when token is not present
        }
    }, [token]);

    // Save token in both context and local storage
    const handleSetToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    
    const contextValue={

        url,
        token,
        setToken: handleSetToken,
        user, 

    }
        return(
          
            <StoreContext.Provider value={contextValue}>
                {props.children}
            </StoreContext.Provider>

        )
    
}

export default StoreContextProvider
