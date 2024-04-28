import { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

const demoCredentials = {
    credential: "demo@guy.com",
    password: "password123",
};

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState("");
    const [disabled, setDisabled] = useState(true);
    const { closeModal } = useModal();

    useEffect(() => {
        if (credential.length < 4 || password.length < 6) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [credential, password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setData("");
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                if (res.status >= 400)
                    setData("The provided credentials were invalid.");
            });
    };

    const logInDemo = () => {
        return dispatch(sessionActions.login(demoCredentials))
        .then(closeModal)
    };

    return (
        <div className="flex-col" id="login-container">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit} className="flex-col" id="login-form">
                {data.length > 0 && <p id="login-error">{data}</p>}
                <label>Username or Email</label>
                <input
                    type="text"
                    value={credential}
                    placeholder="Username or Email"
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={disabled} id="submit">
                    Log In
                </button>
                <button onClick={logInDemo} id="demo-submit">
                    Demo User
                </button>
            </form>
        </div>
    );
}

export default LoginFormModal;
