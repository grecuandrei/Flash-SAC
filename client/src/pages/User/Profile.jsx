import React, { useEffect, useMemo, useState } from "react";
import UserLayout from "../../utils/UserLayout";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../../components/Button";
import { MdDelete, } from "react-icons/md";
import Section from "../../components/Section";
import Table from "../../components/Table";

const Profile = ( ) => {
    const [events, setEvents] = useState([])
    const { getIdTokenClaims, logout, user} = useAuth0();
	  const getToken = async () => {  
        token = await getIdTokenClaims()  
    }  
    let token = getToken()
    const [userBD, setUserBD] = useState({})

    const profileFields = [
        { key: "Email", value: userBD.email },
        { key: "Name", value: userBD.name },
        { key: "Nickname", value: userBD.nickname }
    ];
    
    const columns = useMemo(
      () => [
        {
          Header: "Title",
          accessor: "title",
        },
        {
          Header: "Description",
          accessor: "description",
        },
        {
          Header: "Keywords",
          accessor: "keywords",
        },
        {
          Header: "Date",
          accessor: "start_time",
        },
      ],
      []
    );
	
	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_NODE_API}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
		throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
		callBackendAPI()
		.then(res => {
			setUserBD(res)
      setEvents(res.events)
		})
		.catch(err => console.log(err));
	}, [user]);

  const deleteProfile = () => {
		if(window.confirm("You want to delete account")){
			const requestOptions = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.__raw}`,
			},
			};
			fetch(`${process.env.REACT_APP_NODE_API}/users/${user.sub}`, requestOptions)
			.then(response => {
				if(response.status === 200){
					logout({ returnTo: `${process.env.REACT_APP_URL}` })
          window.location.reload();
				} 
			});
		}
	}

	return (
        <UserLayout>
            <div className="row-between">
                <h2>{userBD.name}</h2>
                <div className="flex flex-row gap-4">
                  <Button
                    className="delete-button"
                    onClick={() => deleteProfile()}
                  >
                    <MdDelete /> Delete
                  </Button>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                <div className="flex flex-row gap-10">
                    <Section title={"Profile Details"} fields={profileFields} />
                    <img src={userBD.picture} style={{width: 200, height: 200, borderRadius: '50%', gap: 10}} />
                </div>
                <div className="flex flex-col gap-5 w-full p-[1px]">
                <p className="section-title">Last Attented Events</p>
                <Table data={events} columns={columns} noHref = {true}/>
                </div>
            </div>
        </UserLayout>
	);
};

export default Profile;