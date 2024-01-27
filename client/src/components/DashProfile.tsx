import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState<string | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageFileUrl(downloadURL);
                });
              }
        )
        
    }

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>profile</h1>
            <form className='flex flex-col gap-4'>
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
                />

                <TextInput 
                    type="email" 
                    id="email" 
                    placeholder="email" 
                    defaultValue={currentUser?.email}
                />

                <TextInput 
                    type="password" 
                    id="password" 
                    placeholder="password"
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
        </div>
    )
}

export default DashProfile