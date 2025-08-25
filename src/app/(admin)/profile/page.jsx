"use client";
import React, { useEffect } from 'react';
import ProfileMain from './components/ProfileMain';
import ProfileAbout from './components/ProfileAbout';
import PopularProfile from './components/PopularProfile';
import PageTItle from '@/components/PageTItle';
const ProfilePage = () => {

  const session1 = (localStorage.getItem('session_token'))
  async function getAllUsers() {

    fetch('http://api-dev.aykutcandan.com/user/detail/get-all',
      {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${decodeURIComponent(session1)}`
        }
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    getAllUsers()
  }, [])

  return <>
    <PageTItle title="PROFILE" />
    <ProfileMain />
    <ProfileAbout />
    <PopularProfile />
  </>;
};
export default ProfilePage;