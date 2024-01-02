import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import { useAuth0 } from "@auth0/auth0-react";

const ViewEventModal = ({ modalIsOpen, closeModal, event }) => {
	const { user, getIdTokenClaims } = useAuth0();
	const getToken = async () => {  
		token = await getIdTokenClaims()  
	}  
	let token = getToken()
	const [attended, setAttended] = useState(false);

	const keywords = event.keywords !== undefined & event.keywords.split(/#(.*)/s).length > 1 ? event.keywords.split(/#(.*)/s)[1].split(',') : ['']
	const dummyDate = new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime())).toUTCString();
	const checkIndex = (event, eventTitle) => event.title === eventTitle;

	const letAttendEvent = (eventTitle) => {
		const requestOptions = {
			method: 'PATCH',
			headers: { 
			  'Content-Type': 'application/json',
			  Authorization: `Bearer ${token.__raw}`
			},
		};
		fetch(`${process.env.REACT_APP_NODE_API}/users/event/${user.sub}/${eventTitle}`, requestOptions)
			.then(response => console.log(response.json()));
	}

	useEffect(() => {
		callBackendAPI()
		.then(res => {
			setAttended(res.events.map(ev => ev.title === event.title).indexOf(true) != -1);
		})
		.catch(err => console.log(err));
	}, [user, event]);

	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_NODE_API}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200) {
			throw Error(body.message)
		}
		return body;
	};

	return (
		<Modal
			isOpen={modalIsOpen}
			onRequestClose={closeModal}
			contentLabel="Rent event"
			className="modal-event"
			ariaHideApp={false}
		>
		<div className="row-between">
			<h2>{event.title}</h2>
			<div className="flex flex-row">
				<Button onClick={closeModal} className="icon-button">
					<MdOutlineClose />
				</Button>
			</div>
		</div>
		<div className="line-event" />
		<div style={{}}>
			<div className="flex flex-col gap-4 py-6 justify-around content-around">
				<div className="flex flex-col">
					<span style={{fontWeight: "bolder"}}>Where?</span>
					<span>{event.location}</span>
				</div>
				<div className="flex flex-col">
					<span style={{fontWeight: "bolder"}}>When?</span>
					<span>{event.start_time ? event.start_time : dummyDate}</span>
				</div>
				<div className="flex flex-col">
					<span style={{fontWeight: "bolder"}}>What should you expect?</span>
					<span>{event.description}</span>
				</div>
				{keywords.length > 1 ? (
				<div className="keyword-list">
					{keywords.map((keyword, index) => (
					index === 0 ? <span key={index}>{'#'+keyword}</span> : index !== keywords.length -1 ? <span key={index}>{keyword}</span> : ""
					))}
				</div>
				) : (<div className="no-keywords">
					<p>No keywords :(</p>
					</div>)}
			</div>
			{
			!attended ? (
			<div>
				<Button type="button" onClick={ () => { console.log(event); letAttendEvent(event.title); }}>
					Attend
				</Button>
			</div>
			) : (
				<p>Already attended</p>
			)
			}
		</div>
		</Modal>
	);
};

export default ViewEventModal;
