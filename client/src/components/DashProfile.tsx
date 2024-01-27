import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateFailure, updateSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

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
  
  interface FormData {
    username?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
  }

const DashProfile = () => {

    const {currentUser} = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch()

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState<string | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(null);
    const [updateUserError, setUpdateUserError] = useState<string | null>(null);

    const filePickerRef = useRef<HTMLInputElement>(null);

    const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = (e.target.files as FileList)?.[0];
        if (file) {
          setImageFile(file);
          setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile]);

    const uploadImage = async () => {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 && 
        //         request.resource.contentType.matches('image/.*')
        //       }
        //     }
        // }

        setImageFileUploading(true)
        setImageFileUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + (imageFile?.name || '');
        const storageref = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageref, imageFile!);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB)');
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL})
                    setImageFileUploading(false)
                });
              }
        )   
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes made")
            return;
        }

        if (imageFileUploading) {
            setUpdateUserError('Please wait for the image to upload');
            return;
        }
        
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
        
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User profile updated successfully")
            }
        } catch (error) {
            if (error instanceof Error) {
                dispatch(updateFailure(error.message));
                setUpdateUserError(error.message);
            } else {
                console.error('Unexpected error type:', error);
            }
        }
    };  

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden/>
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
                    onClick={() => filePickerRef.current?.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                        value={Number(imageFileUploadProgress) || 0}
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${
                                    Number(imageFileUploadProgress) / 100
                                })`,
                            },
                        }}
                      />
                    )}
                    <img 
                        src={imageFileUrl || currentUser?.profilePicture} 
                        alt="user" 
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
                        ${imageFileUploadProgress && Number(imageFileUploadProgress) < 100 && 'opacity-60'}`}
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                )}

                <TextInput 
                    type="text" 
                    id="username" 
                    placeholder="username" 
                    defaultValue={currentUser?.username}
                    onChange={handleChange}
                />

                <TextInput 
                    type="email" 
                    id="email" 
                    placeholder="email" 
                    defaultValue={currentUser?.email}
                    onChange={handleChange}
                />

                <TextInput 
                    type="password" 
                    id="password" 
                    placeholder="password"
                    onChange={handleChange}
                />
                <Button 
                    type="submit" 
                    gradientDuoTone='purpleToBlue'
                    outline
                >
                    Update
                </Button>
            </form>

            <div className='text-red-500 flex justify-between mt-5'>
                <span  className='cursor-pointer'>
                    Delete Account
                </span>
                <span  className='cursor-pointer'>
                    Sign Out
                </span>
            </div>

            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}

            {updateUserError && (
                <Alert color="failure" className="mt-5">
                    {updateUserError}
                </Alert>
            )}
        </div>
    )
}

export default DashProfile