import LoginNav from "./LoginNav";
import "./login.css";

import userData from "../../data/auth.json";
import setCookie from "../../helpers/setCookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const formElements = e.target.elements;

		const username = formElements["username"].value;
		const password = formElements["password"].value;

		if (userData[username] === password) {
			setCookie("user", username, 1);
			navigate("/");
		} else alert("Wrong username or password");
	};

	return (
		<div className="login-wrapper position-absolute" style={{left: "0px"}}>
			<LoginNav />
			<h1 className="text-center mt-5">Welcome Back</h1>
			<p className="text-center clr-dark-gray-20">Please login to continue</p>
			<form
				className="container login-container pb-5 mt-5"
				onSubmit={(e) => handleSubmit(e)}
			>
				<h3 className="text-center mb-4">Login</h3>
				<div className="mb-3 form-floating">
					<input
						type="text"
						id="username"
						className="form-control"
						placeholder="Enter username"
						autoComplete="off"
					/>
					<label htmlFor="username">Username</label>
				</div>
				<div className="mb-3 form-floating">
					<input
						type="password"
						id="password"
						className="form-control"
						placeholder="Enter password"
						autoComplete="off"
					/>
					<label htmlFor="password">Password</label>
				</div>
				<div className="d-grid">
					<button type="submit" className="btn btn-primary">
						Login
					</button>
				</div>
			</form>
		</div>
	);
}
