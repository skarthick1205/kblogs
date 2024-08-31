"use client";

import Image from 'next/image';
import Link from 'next/link';
import { signIn,useSession, signOut } from 'next-auth/react';
import Modal from 'react-modal';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useEffect, useRef, useState } from 'react';

import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";






export default function Header() {

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const captionRef = useRef(null);
  console.log(captionRef);
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);
  console.log(image);
  const [loading, setLoading] = useState(false);

   //Create data post and add it to the collection
   const uploadPost = async () => {
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      profileImg: session?.user?.image,
      username: session?.user?.name,
      caption: captionRef.current.value,
      timestamp: serverTimestamp(),
    });
    //Path for the image
    const imagePath = ref(storage, `posts/${docRef.id}/image`);

    //Upload image to that adress
    //Then with the snapshot declare the download URL
    await uploadString(imagePath, image, "data_url").then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imagePath);
      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
    });
    setImage("");
    setLoading(false);
    captionRef.current.value = null;
  };

  //Add the image to state
  const addImageToState = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImage(readerEvent.target.result);
    };
  };



  return (
    <div className="shadow-lg border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="hidden lg:inline-flex">
          <Image
            src="/logotext.jpg"
            alt="logo"
            width={200}
            height={200}
          />
        </Link>

        <Link href="/" className="lg:hidden">
          <Image
            src="/logoimg.png"
            alt="logo"
            width={100}
            height={100}
          />
        </Link>

        <input type="text" 
          placeholder='search'
          className='bg-blue-50 border border-blue-700 rounded-3xl text-sm w-full py-2 px-4 max-w-[310px]'
        />
       
     
        {session ? (
          <div className='flex gap-2 items-center'>
            
            <IoMdAddCircleOutline
              className='text-6xl ml-3 lg:text-3xl cursor-pointer tranform hover:scale-125 transition duration-300 hover:text-red-600'
              onClick={() => setIsOpen(true)}
            />
            <img
              src={session.user.image}
              alt={session.user.name}
              className='h-10 w-10 rounded-full cursor-pointer'
              onClick={signOut}
            />
            <h6 className="hidden lg:block text-sm">{session.user.name}</h6>
          </div>
        ) : (
          <button
            onClick={signIn}
            className='text-sm font-semibold text-blue-500'
          >
            Log In
          </button>
        )}
        
       
      </div>
      {isOpen && (
        <Modal
        isOpen={isOpen}
        className='w-full max-w-3xl p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 rounded-md shadow-md'
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
      >
        <div className="flex flex-col sm:flex-row items-center sm:h-full w-full">
          <img
            src={session ? session?.user?.image : nouser.src}
            className="rounded-full h-12 w-12"
          />
          <input
            type="text"
            placeholder="What's on your mind Joe Doe?"
            className="outline-0 bg-[#f2f3f7] p-2 sm:ml-5 rounded-full w-full sm:h-12 truncate mt-4 sm:mt-0"
            ref={captionRef}
          />
          <div
            className="flex items-center bg-blue-500 px-3 rounded-full h-10 sm:ml-4 mt-4 sm:mt-0"
            onClick={uploadPost}
          >
            <button className="font-bold text-white">
              {loading ? "Loading" : "Post"}
            </button>
          </div>
        </div>
        <div className="mt-4">
          {image && (
            <div onClick={() => setImage("")}>
              <img src={image} className="p-4 max-h-60 object-cover mx-auto" alt="img" />
            </div>
          )}
        </div>
    
        <div className="border-b mb-4 mt-2"></div>
    
        <div className="flex justify-between px-3 sm:mx-9 pb-3">
          <div className="flex items-center">
            <div className="w-7 h-7">
              <Image src="/camera.png" width={30} height={30}/>
            </div>
            <p className="pl-2 whitespace-nowrap text-[14px]">Live Video</p>
          </div>
    
          <div
            className="flex items-center"
            onClick={() => imageRef.current.click()}
          >
            <div className="w-7 h-7">
              <Image src="/photos.png " width={30} height={30} />
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                onChange={addImageToState}
              />
            </div>
            <p className="pl-2 text-[14px]">Photo/Video</p>
          </div>
    
          <div className="flex items-center">
            <div className="w-7 h-7">
              <Image src="/smile.png" width={30} height={30}/>
            </div>
            <p className="pl-2 text-[14px]">Feeling/Activity</p>
          </div>
        </div>
      </Modal>
      )}
    </div>
  );
}
