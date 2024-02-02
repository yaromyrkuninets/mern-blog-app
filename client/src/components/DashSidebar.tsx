import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

interface RootState {
    user: {
      currentUser: {
        _id: string;
        username: string;
        email: string;
        profilePicture: string;
        isAdmin: boolean;
      };
      error: string | null;
      loading: boolean;
    };
}


const DashSidebar = () => {

    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
        
    }, [location.search]);

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
              });
              const data = await res.json();
        
              if (!res.ok) {
                console.log(data.message);
              } else {
                dispatch(signoutSuccess());
              }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message); 
            } else {
                console.error('Unexpected error type:', error);
            }
        }
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>

                    {
                        currentUser && currentUser.isAdmin && (
                            <Link to='/dashboard?tab=dash'>
                                <Sidebar.Item
                                    active = {tab === 'dash' || !tab}
                                    icon={HiChartPie}
                                    as='div'
                                >
                                    Dashboard
                                </Sidebar.Item>
                            </Link>
                        )
                    }

                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {currentUser.isAdmin && (
                        <>
                            <Link to='/dashboard?tab=posts'>
                                <Sidebar.Item
                                    active = {tab === 'posts'}
                                    icon={HiDocumentText}
                                    as='div'
                                >
                                    Posts
                                </Sidebar.Item>
                            </Link>

                            <Link to='/dashboard?tab=users'>
                                <Sidebar.Item
                                    active = {tab === 'users'}
                                    icon={HiOutlineUserGroup}
                                    as='div'
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>

                            <Link to='/dashboard?tab=comments'>
                                <Sidebar.Item
                                    active = {tab === 'comments'}
                                    icon={HiAnnotation}
                                    as='div'
                                >
                                    Comments
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}

                    <Sidebar.Item 
                        icon={HiArrowSmRight} 
                        className='cursor-pointer'
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar