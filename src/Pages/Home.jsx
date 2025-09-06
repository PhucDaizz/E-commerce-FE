import React from 'react'
import '../Components/Hero/Hero'
import Hero from '../Components/Hero/Hero'
import NewCollections from '../Components/NewCollections/NewCollections'
import { AllProduct } from '../Components/AllProduct/AllProduct'
import ValuePropositionBar from '../Components/ValuePropositionBar/ValuePropositionBar'
const Home = () => {
  return (
    <div>
      <Hero/>
      <ValuePropositionBar/>
      <NewCollections/>
      <AllProduct/>
    </div>
  )
}

export default Home
