import { useAuth } from "../hooks/AuthContext"

const Donation = () => {

    const { isAuthenticated } = useAuth(); 

    return(
        <h1>{ isAuthenticated ? "Logged" : "Not Logged In" }</h1>
    )
}

export default Donation;