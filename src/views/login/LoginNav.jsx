import { Link } from "react-router-dom";

export default function LoginNav() {
	return (
		<nav className="navbar navbar-light bg-light shadow-sm position-fixed top-0 start-0 end-0">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					{/* <img
						src="/docs/5.0/assets/brand/bootstrap-logo.svg"
						alt=""
						width="30"
						height="24"
						className="d-inline-block align-text-top"
					/> */}
					Restaurant Billing System
				</Link>
			</div>
		</nav>
	);
}
