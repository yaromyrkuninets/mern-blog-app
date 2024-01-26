import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

interface RootState {
    user: {
        currentUser: any;
    };
}

const PrivateRoute = () => {
    const { currentUser } = useSelector((state: RootState) => state.user);

    return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}

export default PrivateRoute