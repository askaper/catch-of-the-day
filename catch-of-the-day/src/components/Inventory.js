import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {

  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }

  //Listens to see if user is logged in after app loads
  componentDidMount() {
    base.onAuth((user) => {
      if(user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    //take copy of fish then push to state
    const updatedFish = {
      ...fish,
    [e.target.name]: e.target.value
    }
    this.props.updateFish(key, updatedFish);
  }

  authenticate(provider) {
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler)
  }

  authHandler(err, authData) {
    console.log(authData);
    if(err) {
      console.error(err);
      return
    }

    // Grabs the store info
    const storeRef = base.database().ref(this.props.storeId);

    // Query firebase for store database
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // Claim it as our own if there is no owner already.
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In With GitHub</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In With Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In With Twitter</button>
      </nav>
    )
  }

  renderInventory(key) {
    const fish = this.props.fishes[key]
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Name" />
        <input type="text" name="price" value={fish.price} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Price" />
        <select type="text" name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Desc"></textarea>
        <input type="text" name="image" value={fish.image} onChange={(e) => this.handleChange(e, key)} placeholder="Fish Image" />
        <button onClick={() => this.props.removeFish(key)} >Remove Fish</button>
      </div>
    )
  }
  render() {
    const logout = <button>Log Out</button>
    //Check if there is a user logged in w/ fb, gh, or twitter
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }
    //Check if user is the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of the store.</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
      <h2>Inventory</h2>
      {logout}
      {Object.keys(this.props.fishes).map(this.renderInventory)}
      <AddFishForm addFish={this.props.addFish} />
      <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
};

export default Inventory;
