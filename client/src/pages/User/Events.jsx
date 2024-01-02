import React, { useEffect, useState } from "react";
import UserLayout from "../../utils/UserLayout";
import EventCard from "../../components/EventCard";
import Keywords from "../../components/Keywords";
import ViewEventModal from "../../components/modals/ViewEventModal";
import { useAuth0 } from "@auth0/auth0-react";

const UserEvents = () => {
	const [keywords, setKeywords] = useState([]);
	const [openedModal, setOpenedModal] = useState(false);
	const [openedViewModal, setOpenedViewModal] = useState(false);
	const [currentEvent, setEvent] = useState({title:"", description:"", location:"", keywords:"", start_time:null, image_link:""});
	const [availableEvents, setAvailablEvents] = useState([]);
	const { user, getIdTokenClaims } = useAuth0();

	const getToken = async () => {  
		token = await getIdTokenClaims()  
	  }  
	  let token = getToken()
	
	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_NODE_API}/events/all/${user.sub}/?keywords=${encodeURIComponent(JSON.stringify(keywords))}`);
		const body = await response.json();

		if (response.status !== 200) {
			throw Error(body.message)
		}
		return body;
	};

	useEffect(() => {
		callBackendAPI()
		.then(res => {
			setAvailablEvents(res)
		})
		.catch(err => console.log(err));
	}, [keywords, openedModal, openedViewModal]);

	const handleClick = (event) => {
		setEvent(event);
		setOpenedModal(true);
	};

	const openViewEvent = (event) => {
		setEvent(event);
		setOpenedViewModal(true);
	};

	return (
		<UserLayout>
			<ViewEventModal
				event={currentEvent}
				modalIsOpen={openedViewModal}
				closeModal={() => {
					setOpenedViewModal(false);
				}}
			/>
			<Keywords
				keywords={keywords}
				setKeywords={setKeywords}
				label="Keywords"
				placeholder="Press enter to save keyword"
				maxKeywords={10}
			/>
			<div className="events">
				{availableEvents.map((event, index) => (
					<EventCard key={index} {...event} handleClick={handleClick} viewModal={openViewEvent}/>))
				}
			</div>
		</UserLayout>
	);
};

export default UserEvents;
