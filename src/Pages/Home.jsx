import React from 'react'
import '../Components/Hero/Hero'
import Hero from '../Components/Hero/Hero'
import NewCollections from '../Components/NewCollections/NewCollections'
import { AllProduct } from '../Components/AllProduct/AllProduct'
const Home = () => {
  return (
    <div>
      <Hero/>
      <NewCollections/>
      <AllProduct/>
    </div>
  )
}

export default Home
