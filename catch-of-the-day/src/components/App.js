import React from 'react';
import Header from './Header';
import StorePicker from './StorePicker';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import Inventory from './Inventory';
import Fish from './Fish';

//Parent component of app. This is where state will be set.

class App extends React.Component {
  constructor() {
    super();
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    // This is the initial state.
    this.state = {
      fishes: {},
      order: {}
    };
  }

  addFish(fish) {
    //update state
    const fishes = {...this.state.fishes}; //takes a copy of existing state then puts it into this state or variable
    //add in our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    //set state
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(key => <Fish key={key} />)}
          </ul>
        </div>
        <Order />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} /> {/*this is how we pass props to child components */}
      </div>
    )
  }
}

export default App;
