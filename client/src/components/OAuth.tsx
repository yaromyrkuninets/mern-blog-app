import { GoogleAuthProvider, signInWithPopup, UserCredential, getAuth, User  } from 'firebase/auth';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { app } from '../firebase';
import { UseDispatch, useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

interface ResultsFromGoogle {
    user: User;
}

const OAuth = () => {

    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({promt: 'select_account'})

        try {
            const resultsFromGoogle: UserCredential & ResultsFromGoogle = await signInWithPopup(auth, provider);
            
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL 
                })
            })

            const data = await res.json();

            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }

        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
            Continue with Google
        </Button>
    )
}

export default OAuth