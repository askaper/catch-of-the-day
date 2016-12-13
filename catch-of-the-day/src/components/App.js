import React from 'react';
import Header from './Header';
import StorePicker from './StorePicker';
import Order from './Order';
import Inventory from './Inventory';

//Parent component of app. This is where state will be set.

class App extends React.Component {
  constructor() {
    super();
    this.addFish = this.addFish.bind(this);
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

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
        </div>
        <Order />
        <Inventory addFish={this.addFish}/> {/*this is how we pass props to child components */}
      </div>
    )
  }
}

export default App;
