import React from 'react';
import Header from './Header';
import StorePicker from './StorePicker';
import Order from './Order';
import sampleFishes from '../sample-fishes';
import Inventory from './Inventory';
import Fish from './Fish';
import base from '../base';

//Parent component of app. This is where state will be set.

class App extends React.Component {
  constructor() {
    super();
    // 'this' keyword binding to state-pushing methods
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    // This is the initial state.
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    //this rune before app is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    //check for any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      //update app Component in order's state.
      this.setState({
        order: JSON.parse(localStorageRef)
      });

    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
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

  addToOrder(key) {
    //copy state
    const order = {...this.state.order};

    //push to state
    order[key] = order[key] + 1 || 1;
    this.setState({ order })
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes)
              .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} params={this.props.params} />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} /> {/*this is how we pass props to child components */}
      </div>
    )
  }
}

export default App;
