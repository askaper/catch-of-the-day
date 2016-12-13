import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

  constructor() {
    super();
    this.goToStore = this.goToStore.bind(this);
  }

  goToStore(e) {
    e.preventDefault();
    console.log('You changed it, fam', this.storeInput.value);
    //First grab text from the box

    //Storing value into variable because lazy
    const storeId = this.storeInput.value;
    console.log('america fuck yeah', storeId);

    //Second, transition from / to /store/:storeId
    this.context.router.transitionTo(`/store/${storeId}`);
  }

  render() {
    return (
      <div>
        <form className="store-selector" onSubmit={this.goToStore}>
          <h2>Please Enter A Store</h2>
          <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => { this.storeInput = input }}/>
          <button type="submit"> Visit Store -></button>
        </form>
      </div>
    )
  }
}

//Selecting the router through contextTypes
StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
