"use client";

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';


export default function Header() {
 

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
        
        <button onClick={() => signIn()} className='text-2xl bg-blue-50 font-semibold p-2 rounded-md text-blue-500'>
          LOGIN
        </button>
        
       
      </div>
    </div>
  );
}
