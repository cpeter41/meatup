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
    const [errors, setErrors] = useState({});
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
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    const logInDemo = () => {
        // return dispatch(sessionActions.login(demoCredentials)).then(closeModal);
        setCredential(demoCredentials.credential);
        setPassword(demoCredentials.password);
    };

    return (
        <div className="flex-col">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit} className="flex-col">
                <label>
                    <input
                        type="text"
                        value={credential}
                        placeholder="Username or Email"
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.credential && <p>{errors.credential}</p>}
                <button type="submit" disabled={disabled}>
                    Log In
                </button>
                <button onClick={logInDemo} type="submit">
                    Demo User Log In
                </button>
            </form>
        </div>
    );
}

export default LoginFormModal;
