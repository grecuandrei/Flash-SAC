import React, { useState } from "react";
import Button from "../Button";
import loggo from "../../assets/flash.ico";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Keywords from "../Keywords";

const Register = () => {
    const [keywords, setKeywords] = useState([]);
    const { logout, user, getIdTokenClaims } = useAuth0();
    const getToken = async () => {  
        token = await getIdTokenClaims()  
    }  
    let token = getToken()
    const navigate = useNavigate();

    const saveUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.__raw}`,
            },
            body: JSON.stringify({
                guid: user.sub,
                name: user.name,
                nickname: user.nickname,
                picture: user.picture,
                email: user.email,
                keywords: '#'+keywords.join(', #')
            })
        };
        fetch(`${process.env.REACT_APP_NODE_API}/users/`, requestOptions)
            .then(response => {
                if (response.status !== 500) {
                    
                    navigate("/home");
                } else {
                    console.log(response.json())
                }
            }).catch(err => {
                console.log(err)
            });
    }


    return (
        <div className="register-row">
            {/* <img className="register-backgroundLoggo" src={bg} alt="bg"/> */}
            <div className="modalRegAD">
                <p>Your AD can be here!</p>
                <p>Contact us!</p>
            </div>
            
            <div className="modalRegAll">
                <div className="modalReg">
                    <img src={loggo} alt="Flash logo" />
                    <div className="row-between">
                        <h2>Add your # interests!</h2>
                    </div>
                    <Keywords
                        keywords={keywords}
                        setKeywords={setKeywords}
                        placeholder="Press enter to save a keyword (max. 15)"
                        maxKeywords={15}
                    />
                </div>
                <div className="buttons">
                    <Button type="button" onClick={ () => { saveUser(); } }>
                        Enter
                    </Button>
                    <Button type="button" onClick={ () => { logout({ returnTo: window.location.origin }); } }>
                        Exit
                    </Button>
                </div>
                {/* <form>
                    <Input label="Name" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}/>
                    <Input label="Surname" placeholder="Your surname" value={surname} onChange={e => setSurname(e.target.value)}/>
                    <Input label="Phone" placeholder="Your phone number" pattern="[0-9]*" value={phone} onChange={e => setPhone(e.target.value)} />
                    <Input label="Pid" placeholder="Your personal identification number" value={pid} onChange={e => setPid(e.target.value)}/>
                    <p type="p">What do you want to be?</p>
                    <div>
                        <div class="flex justify-center items-center">
                            <div class="bg-gray-200 rounded-lg">
                                <div class="inline-flex rounded-lg" onClick={ () => {setChecked(false)}}>
                                    <input type="radio" name="room_type" id="roomPrivate" checked hidden/>
                                    <label for="roomPrivate" class="radio text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75">Customer</label>
                                </div>
                                <div class="inline-flex rounded-lg" onClick={ () => {setChecked(true)}}>
                                    <input type="radio" name="room_type" id="roomPublic" hidden/>
                                    <label for="roomPublic" class="radio text-center self-center py-2 px-4 rounded-lg cursor-pointer hover:opacity-75">Publisher</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button type="button" onClick={ () => { saveUser(); } }>
                        Register
                    </Button>
                    <Button type="button" onClick={ () => { logout({ returnTo: window.location.origin }); } }>
                        Logout
                    </Button>
                </form> */}
            </div>
        </div>
        
    );
};

export default Register;
