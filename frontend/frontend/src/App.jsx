import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

function App() {

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [wallet, setWallet] = useState("");

  const goal = 10; // donation goal in ETH

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      setWallet(accounts[0]);
    } else {
      alert("Please install MetaMask");
    }
  };

  const donate = async () => {

    try {

      const response = await axios.post("http://localhost:3000/donate", {
        amount: amount,
        senderPrivateKey:
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      });

      const tx = response.data.txHash;

      const newDonation = {
        amount: parseFloat(amount),
        txHash: tx,
        time: new Date().toLocaleString()
      };

      setDonations([newDonation, ...donations]);
      setTotal(total + parseFloat(amount));

      setMessage("Donation successful!");

      setAmount("");

    } catch (error) {

      setMessage("Donation failed");
      console.error(error);

    }

  };

  const progress = (total / goal) * 100;

  return (

    <div className="container">

      <header className="hero">

        <h1>Transparent Donation Tracker</h1>
        <p>All donations are permanently recorded on blockchain</p>

        <button className="wallet-btn" onClick={connectWallet}>
          {wallet ? wallet.slice(0,6) + "..." + wallet.slice(-4) : "Connect Wallet"}
        </button>

        <div className="stats">
          <h2>{total} ETH</h2>
          <p>Total Donations Raised</p>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{width: progress + "%"}}></div>
        </div>

        <p>Goal: {goal} ETH</p>

      </header>


      <div className="donation-card">

        <h2>Make a Donation</h2>

        <input
          type="number"
          placeholder="Enter amount in ETH"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />

        <button onClick={donate}>Donate</button>

        <p className="message">{message}</p>

      </div>


      <div className="history">

        <h2>Recent Donations</h2>

        {donations.length === 0 && <p>No donations yet</p>}

        {donations.map((d,i)=>(
          <div key={i} className="donation-item">

            <p><b>Amount:</b> {d.amount} ETH</p>

            <p><b>Time:</b> {d.time}</p>

            <a
              href={"https://sepolia.etherscan.io/tx/" + d.txHash}
              target="_blank"
            >
              View Transaction
            </a>

          </div>
        ))}

      </div>

      <footer>

        <p>Powered by Ethereum Blockchain</p>

      </footer>

    </div>
  );
}

export default App;