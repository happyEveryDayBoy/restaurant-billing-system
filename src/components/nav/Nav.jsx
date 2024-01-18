import "./nav.css";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { toggleNavbar as toggleNavbarSlice } from "../../redux/slices/navbarSlice";
import { setViewTitle } from "../../redux/slices/titleSlice";
import setCookie from "../../helpers/setCookie";

import { ReactComponent as NewSVG } from "../../static/icons/New.svg";
import { ReactComponent as OpenSVG } from "../../static/icons/Open.svg";
import { ReactComponent as ExpensesSVG } from "../../static/icons/Expenses.svg";
import { ReactComponent as SalesSVG } from "../../static/icons/sales.svg";
import { ReactComponent as BalanceSVG } from "../../static/icons/Balance.svg";
import { ReactComponent as UserSVG } from "../../static/icons/user.svg";
import { ReactComponent as ReportSVG } from "../../static/icons/report.svg";

export default function Nav() {
	// const [isNavOpen, setIsNavOpen] = useState(false);
	const isNavOpen = useSelector((state) => state.navbarState);
	const title = useSelector((state) => state.viewTitle);
	const outletInfo = useSelector((state) => state.outletInfo.outlet);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toggleNavbar = () => {
		dispatch(toggleNavbarSlice());
	};

	const userLogOut = () => {
		setCookie("user", "", -1);
		navigate("/login");
	}

	useEffect(() => {
		dispatch(setViewTitle(window.location.href.split("#")?.[1]?.replace("/","") || "new"));
	}, [])

	return (
		<div id="sidebar" className={isNavOpen ? "body-pd" : ""}>
			<header
				className={isNavOpen ? "header body-pd" : "header"}
				id="header"
			>
				<h1 className="ms-3 mb-0 h4 me-auto text-capitalize">{title}</h1>
				<div className="header_img d-flex justify-content-center rounded rounded-circle dropdown">
					<span className="d-block my-auto dropdown-toggle cursor-pointer pe-3" id="user-options-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
						<UserSVG />
					</span>
					<ul className="dropdown-menu" aria-labelledby="user-options-dropdown">
						<li className="text-danger dropdown-item" onClick={() => userLogOut()}>Log out</li>
					</ul>
				</div>
			</header>
			<div
				className={isNavOpen ? "l-navbar show" : "l-navbar"}
				id="nav-bar"
			>
				<nav className="nav">
					<div>
						<Link to="/" className="text-decoration-none nav_logo">
							<i className="bx bx-layer nav_logo-icon"></i>
							<span className="nav_logo-name">
								{outletInfo.outlet_name}
							</span>
						</Link>
						<div className="nav_list">
							<Link
								to="/new"
								className={
									(title === "new" ? "active " : "") +
									"text-decoration-none nav_link"
								}
								title="New Bill"
							>
								<NewSVG className="nav_svg-fill-dark-blue" />
								<span className="nav_name">New</span>{" "}
							</Link>
							<Link
								to="/open"
								className={
									(title === "open" ? "active " : "") +
									"text-decoration-none nav_link"
								}
								title="Open Bill"
							>
								<OpenSVG className="nav_svg-fill-dark-blue" />
								<span className="nav_name">Open</span>{" "}
							</Link>
							<Link
								to="/sales"
								className={
									(title === "sales" ? "active " : "") +
									"text-decoration-none nav_link"
								}
								title="Sales"
							>
								<SalesSVG className="nav_svg-stroke-dark-blue" />
								<span className="nav_name">Sales</span>{" "}
							</Link>
							<Link
								to="/expenses"
								className={
									(title === "expenses" ? "active " : "") +
									"text-decoration-none nav_link"
								}
								title="Expenses"
							>
								<ExpensesSVG className="nav_svg-stroke-dark-blue" />
								<span className="nav_name">Expenses</span>{" "}
							</Link>
							<Link
								to="/balance"
								className={
									(title === "balance" ? "active " : "") +
									"text-decoration-none nav_link"
								}
								title="Balance"
							>
								{" "}
								<BalanceSVG className="nav_svg-stroke-dark-blue" />
								<span className="nav_name">Balances</span>{" "}
							</Link>{" "}
							<Link
								to="/reports"
								className={
									(title === "reports" ? "active " : "") +
									"text-decoration-none nav_link"
								}
								title="Reports"
							>
								{" "}
								<ReportSVG className="nav_svg-stroke-dark-blue" />
								<span className="nav_name">Reports</span>{" "}
							</Link>{" "}
						</div>
					</div>{" "}
					<Link to="" className={"text-decoration-none nav_link"}>
						<div className="header_toggle d-flex align-items-center" onClick={toggleNavbar}>
							{" "}
							<i
								className={(isNavOpen ? "bx-x" : "bx-menu") + " bx me-2 fs-4 clr-dark-gray"}
								id="header-toggle"
							></i>
							<span className={(isNavOpen ? "" : "d-none") + "clr-dark-gray"}>Collapse</span>
						</div>
					</Link>
				</nav>
			</div>
		</div>
	);
}
