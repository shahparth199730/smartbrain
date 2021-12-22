import React, { Component } from 'react'
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Signin from './components/signin/Signin'
import Register from './components/register/Register'
// import Particles from "react-tsparticles";
// import Clarifai from 'clarifai';


// const particlesOptions = {
//   interactivity: {
//           events: {
//             onClick: {
//               enable: true,
//               mode: "push",
//             },
//             onHover: {
//               enable: true,
//               mode: "repulse",
//             },
//             resize: true,
//           },
          
//         },
//         particles: {
//           color: {
//             value: "#ffffff",
//           },
//           links: {
//             color: "#ffffff",
//             distance: 150,
//             enable: true,
//             opacity: 0.5,
//             width: 1,
//           },
//           collisions: {
//             enable: true,
//           },
//           move: {
//             direction: "none",
//             enable: true,
//             outMode: "bounce",
//             random: false,
//             speed: 6,
//             straight: false,
//           },
//           number: {
//             density: {
//               enable: true,
//               value_area: 800,
//             },
//             value: 80,
//           },
//           opacity: {
//             value: 0.5,
//           },
//           shape: {
//             type: "square",
//           },
//           size: {
//             random: true,
//             value: 5,
//           },
//         },
//         detectRetina: true,
// }
// const particlesInit = (main) => {
//   console.log(main);
//   // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
// };

// const particlesLoaded = (container) => {
//   console.log(container);
// };
const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route:'signin',
      isSignedIn: false,
      user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        joined: ''
      }
    }
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }
  
  loadUser = (data) => {
    this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
    }})
  }
  calculateFaceLocation = (data) => {
    const calrifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: calrifaiFace.left_col*width,
      topRow: calrifaiFace.top_row*height,
      rightCol: width - (calrifaiFace.right_col*width),
      bottomRow: height - (calrifaiFace.bottom_row*height),
    }
  }
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
    console.log(event.target.value);
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    // console.log('Submit');
    fetch('https://obscure-plateau-03105.herokuapp.com/imageurl',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
    .then( response => response.json())
    .then( response => {
      if (response){
        fetch('https://obscure-plateau-03105.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        .catch(console.log)
      } 
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))  
  }
  onRouteChange = (route) => {
    console.log(route)
    if(route === 'signout'){
      console.log(initialState)
      this.setState(initialState)
      console.log(this.setState)
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
    // console.log({isSignedIn})
  }
  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        {/*<Particles className='particles'
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
    />*/}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route==='home'? 
        <div>
        <Logo/>
        <Rank name={this.state.user.name}
        entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={imageUrl} box={box}/>
        </div> : 
        (route==='register'? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> : 
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )}
      </div>
    );
  }
}

export default App;