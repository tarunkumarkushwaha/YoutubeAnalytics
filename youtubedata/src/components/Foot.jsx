import { Link } from "react-router-dom";
import { useContext } from 'react';
import { Context } from '../MyContext';

const Foot = () => {

  return (
    <>
      <footer className="">
        <span className={`block md:text-sm text-xs text-center`}>© 2026 Youtube Analytics by tarun™<Link to="/" className="hover:underline">. All Rights Reserved.</Link></span>
      </footer>
    </>
  )
}

export default Foot