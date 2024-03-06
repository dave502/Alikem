import { useEffect, useState } from 'react';
import { varNeoUser } from '../../variables';
import { gql, useQuery, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { useNavigate } from 'react-router-dom';


function NeoUser(props) {
    
    const { user } = props;
    const [userAuthorized, setUserAuthorized] = useState(true);
    const neoUser = useReactiveVar(varNeoUser);
    const navigate = useNavigate();

      
    useEffect(() => {
      if (user){
          gqlReadUserProfile({ uid: user.uid })
          .then((resp) => {
          const neo_user = new Object();
          Object.entries(resp.data.users[0]).forEach(v => neo_user[v[0]] = v[1] || undefined)
          varNeoUser(neo_user)
          })
          .catch((error) => {
            console.log("gqlReadUserProfile error", error)
          });
      }
    }, [user]);

    
    const READ_USER_POFILE = gql`
    query Users($uid: String!)
    {
      users( where: {uid: $uid} )
      {
        name
        gender
        birthday
        city
        cityID
        img    
      }
    }
    `;
    const { loading: gqlUserLoading, 
        error: gqlUserError, 
        data: gqlUserData, 
        refetch: gqlReadUserProfile} = 
        useQuery(READ_USER_POFILE, 
        {
          variables: { uid: user?.uid },
        });
}

export default NeoUser;
