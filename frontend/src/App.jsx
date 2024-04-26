import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation-bonus";
import LandingPage from "./components/LandingPage";
import GroupsList from "./components/GroupsList";
import GroupPage from "./components/GroupPage";
import GroupForm from "./components/GroupForm";
import EventsList from "./components/EventsList";
import EventPage from "./components/EventPage";
import * as sessionActions from "./store/session";
import { Modal } from "./context/Modal";

function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(sessionActions.restoreUser()).then(() => {
            setIsLoaded(true);
        });
    }, [dispatch]);

    return (
        <>
            <Modal />
            <Navigation isLoaded={isLoaded} />
            {isLoaded && <Outlet />}
        </>
    );
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/groups",
                element: <GroupsList />,
            },
            {
                path: "/groups/new",
                element: <GroupForm />,
            },
            {
                path: "/groups/:groupId",
                element: <GroupPage />,
            },
            {
                path: "/groups/:groupId/edit",
                element: <GroupForm update={true} />,
            },
            {
                path: "/events",
                element: <EventsList />,
            },
            {
                path: "/events/:eventId",
                element: <EventPage />,
            },
            {
                path: "*",
                element: <h1>Page Not Found</h1>,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
