import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import Brain from './brain.png';
const Logo = () => {
	return(
		<div className='ma4 mt0'>
		<Tilt className='Tilt br2 shadow-2' options={{max : 55}}style={{ height: 150, width: 150 }} tiltEnable={true} glareEnable={true} glareMaxOpacity={0.8} glareColor="black" glarePosition="bottom">
	      <div className='Tilt-inner pa3'>
	        <img style={{paddingTop : '5px'}} src={Brain} alt='brain'/>
	      </div>
	    </Tilt>
		</div>
	);
}

export default Logo;