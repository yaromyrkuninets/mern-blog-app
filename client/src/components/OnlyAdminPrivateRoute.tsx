import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

interface RootState {
    user: {
        currentUser: any;
    };
}

const OnlyAdminPrivateRoute = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return currentUser && currentUser.isAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default OnlyAdminPrivateRoute;