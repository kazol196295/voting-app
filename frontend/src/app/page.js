'use client'; // Required for Next.js App Router

import { useState } from 'react';
import { getVotingContract } from './utils/voting';

export default function VotingDApp() {
  const [account, setAccount] = useState(null);
  const [electionName, setElectionName] = useState('');
  const [duration, setDuration] = useState('');
  const [electionId, setElectionId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [voteElectionId, setVoteElectionId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [endElectionId, setEndElectionId] = useState('');
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      const { contract, signer } = await getVotingContract();
      const address = await signer.getAddress();
      setAccount(address);
      console.log('Connected address:', address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Please install MetaMask and connect to the Sepolia network');
    }
  };

  // Create Election
  const createElection = async () => {
    try {
      const { contract } = await getVotingContract();
      const tx = await contract.createElection(electionName, parseInt(duration));
      await tx.wait();
      alert('Election created!');
      setElectionName('');
      setDuration('');
    } catch (error) {
      console.error(error);
      alert('Error creating election: ' + error.message);
    }
  };

  // Add Candidate
  const addCandidate = async () => {
    try {
      const { contract } = await getVotingContract();
      const tx = await contract.addCandidate(parseInt(electionId), candidateName);
      await tx.wait();
      alert('Candidate added!');
      setElectionId('');
      setCandidateName('');
    } catch (error) {
      console.error(error);
      alert('Error adding candidate: ' + error.message);
    }
  };

  // Vote
  const vote = async () => {
    try {
      const { contract } = await getVotingContract();
      const tx = await contract.vote(parseInt(voteElectionId), parseInt(candidateId));
      await tx.wait();
      alert('Vote cast!');
      setVoteElectionId('');
      setCandidateId('');
    } catch (error) {
      console.error(error);
      alert('Error voting: ' + error.message);
    }
  };

  // End Election
  const endElection = async () => {
    try {
      const { contract } = await getVotingContract();
      const tx = await contract.endElection(parseInt(endElectionId));
      await tx.wait();
      alert('Election ended!');
      setEndElectionId('');
    } catch (error) {
      console.error(error);
      alert('Error ending election: ' + error.message);
    }
  };

  // Get Candidate
  const getCandidate = async () => {
    try {
      const { contract } = await getVotingContract();
      const [id, name, voteCount] = await contract.getCandidate(parseInt(electionId), parseInt(candidateId));
      setCandidateInfo({ id: id.toString(), name, voteCount: voteCount.toString() });
    } catch (error) {
      console.error(error);
      alert('Error fetching candidate: ' + error.message);
    }
  };

  // Get Winner
  const getWinner = async () => {
    try {
      const { contract } = await getVotingContract();
      const [winnerId, name, voteCount] = await contract.getWinner(parseInt(endElectionId));
      setWinnerInfo({ winnerId: winnerId.toString(), name, voteCount: voteCount.toString() });
    } catch (error) {
      console.error(error);
      alert('Error fetching winner: ' + error.message);
    }
  };

  // Handle MetaMask network/account changes
  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.on('chainChanged', () => window.location.reload());
  //     window.ethereum.on('accountsChanged', () => window.location.reload());
  //   }
  // }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Voting dApp</h1>
      {!account ? (
        <button
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          
          <h2>Create Election</h2>
          <input
            type="text"
            placeholder="Election Name"
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            onClick={createElection}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Create Election
          </button>

          <h2>Add Candidate</h2>
          <input
            type="number"
            placeholder="Election ID"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Candidate Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            onClick={addCandidate}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Add Candidate
          </button>

          <h2>End Election</h2>
          <input
            type="number"
            placeholder="Election ID"
            value={endElectionId}
            onChange={(e) => setEndElectionId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            onClick={endElection}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            End Election
          </button>

          <h2>Get Candidate</h2>
          <input
            type="number"
            placeholder="Election ID"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Candidate ID"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            onClick={getCandidate}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Get Candidate
          </button>
          {candidateInfo && (
            <p>
              Candidate: {candidateInfo.name} (ID: {candidateInfo.id}) with {candidateInfo.voteCount} votes
            </p>
          )}

          <h2>Vote</h2>
          <input
            type="number"
            placeholder="Election ID"
            value={voteElectionId}
            onChange={(e) => setVoteElectionId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Candidate ID"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            onClick={vote}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Vote
          </button>

          <h2>Get Winner</h2>
          <input
            type="number"
            placeholder="Election ID"
            value={endElectionId}
            onChange={(e) => setEndElectionId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button
            onClick={getWinner}
            style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Get Winner
          </button>
          {winnerInfo && (
            <p>
              Winner: {winnerInfo.name} (ID: {winnerInfo.winnerId}) with {winnerInfo.voteCount} votes
            </p>
          )}
        </div>
      )}
    </div>
  );
}



    Directory: D:\blockchain\voting app\frontend


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         15-Jul-25  12:53 PM                .next
d-----         15-Jul-25  12:23 PM                node_modules
d-----         15-Jul-25  12:22 PM                public
d-----         15-Jul-25  12:22 PM                src





    Directory: D:\blockchain\voting app\frontend\src


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         15-Jul-25  12:22 PM                app