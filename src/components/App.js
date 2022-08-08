import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import OnlyToken from '../abis/OnlyToken.json'

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const onlyTokenAddress = "0xdB295D6F4752c1A6e62dE31A92f655859375c79f" // Replace token Address Here
    const onlyToken = new web3.eth.Contract(OnlyToken.abi, onlyTokenAddress)
    this.setState({ onlyToken: onlyToken })
    const balance = await onlyToken.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
    const transactions = await onlyToken.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    console.log(transactions)
  }

  transfer(recipient, amount) {
    this.state.onlyToken.methods.transfer(recipient, amount).send({ from: this.state.account })
  }

  

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      onlyToken: null,
      balance: 0,
      transactions: []
    }

    this.transfer = this.transfer.bind(this)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <p>
            OnlyTokens
          </p>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                <h1>{this.state.balance} OTK</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const recipient = this.recipient.value
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                  this.transfer(recipient, amount)
                }}>
                  <div className="form-group mr-sm-2">
                    <input
                      id="recipient"
                      type="text"
                      ref={(input) => { this.recipient = input }}
                      className="form-control"
                      placeholder="Recipient Address"
                      required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input
                      id="amount"
                      type="text"
                      ref={(input) => { this.amount = input }}
                      className="form-control"
                      placeholder="Amount"
                      required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
