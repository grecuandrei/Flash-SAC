import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserEvents from "../pages/User/Events";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import Profile from "../pages/User/Profile";
import Register from "../components/modals/Register";

const Router = () => {
	const { user, isAuthenticated, loginWithRedirect } = useAuth0();
	const [userExists, setUserExists] = useState(2);

	useEffect(() => {
		if (!isAuthenticated) {
		loginWithRedirect();
		}
	}, [ isAuthenticated, loginWithRedirect]);

	const callBackendAPI = async () => {
		const response = await fetch(`${process.env.REACT_APP_NODE_API}/users/guid/${user.sub}`);
		const body = await response.json();

		if (response.status !== 200 && response.status !== 404) {
			throw Error(body.message)
		}
		return response;
	};

	function CheckRegister() {
		useEffect(() => {
		callBackendAPI()
		.then(res => {
			if (res.status === 200) {
				setUserExists(1);
			} else if (res.status === 404) {
				setUserExists(0);
			}
		})
		.catch(err => {return err});
		}, []);

		if (userExists === 1) {
			return <Navigate to={"/home"}/>;
		} else if (userExists === 0) {
			return <Navigate to={"/register"}/>
		}

		return <Loading />;
	}

	return (
		isAuthenticated && ( 
		<BrowserRouter>
			<Routes>
			<Route exact path="/" element={CheckRegister()} />
			<Route exact path="/home" element={<UserEvents/>} />
			<Route exact path="/profile" element={<Profile/>} />
			<Route exact path="/register" element={<Register/>} />
			</Routes>
		</BrowserRouter>
		)
	);
};

export default Router;
