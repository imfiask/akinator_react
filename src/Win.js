import { useLocation } from "react-router-dom"
//import { useState, useEffect, useRef } from 'react'
import './Home.css'

function Win() {
  const location = useLocation()
  const { name, image } = location.state || {}

  return (
    <div className="Home">
      <p style={{whiteSpace: 'pre-line'}}>Il tuo personaggio è <strong>{name}</strong>!</p>
      <img src={image} alt={name} style={{width: "250px"}}/><br/>
      <button onClick={async() => {}}>sì</button>
      <button onClick={async() => {}}>no</button>
    </div>
  )
}

export default Win