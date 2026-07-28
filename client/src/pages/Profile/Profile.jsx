import { useEffect, useState } from "react";
import { getProfile } from "../../services/authService";


function Profile(){

    const [user,setUser] = useState(null);


    useEffect(()=>{

        getProfile()
        .then((response)=>{
            setUser(response.data);
        })
        .catch((error)=>{
            console.log(error);
        });

    },[]);

    return (
        <>
            <h2>Profile</h2>
            {
                user && (
                    <>
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Role: {user.role}</p>
                    </>
                )
            }

        </>
    );
}

export default Profile;