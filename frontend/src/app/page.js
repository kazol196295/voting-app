'use client'; // Required for Next.js App Router

import { useState } from 'react';
import { getVotingContract } from './utils/voting';

export default function VotingDApp() {
  const [elections, setElections] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
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

  const fetchAllElections = async () => {
    try {
      const { contract } = await getVotingContract();
      // getAllElections returns: [ids, names, currentTime, endtimes, actives]
      const [ids, names, currentTimeOnChain, endtimes, actives] = await contract.getAllElections();
      setCurrentTime(currentTimeOnChain.toString());
      const electionsArr = ids.map((id, idx) => ({
        id: id.toString(),
        name: names[idx],
        endtime: endtimes[idx].toString(),
        active: actives[idx],
      }));
      setElections(electionsArr);
    } catch (error) {
      console.error(error);
      alert('Error fetching elections: ' + error.message);
    }
  };

  const deleteElection = async (eid) => {
    try {
      const { contract } = await getVotingContract();
      const tx = await contract.deleteElection(parseInt(eid));
      await tx.wait();
      alert('Election deleted!');
      fetchAllElections();
    } catch (error) {
      console.error(error);
      alert('Error deleting election: ' + error.message);
    }
  };



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
      {currentTime && (
        <div style={{ marginBottom: '10px', color: '#555' }}>
          <strong>Current Blockchain Time:</strong> {currentTime}
        </div>
      )}

      {account && (
        <>
          <button
            onClick={fetchAllElections}
            style={{ margin: '10px 0', padding: '8px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: '5px' }}
          >
            Show All Elections
          </button>
          {elections.length > 0 && (
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>ID</th>
                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>End Time</th>
                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>Active</th>
                  <th style={{ border: '1px solid #ccc', padding: '6px' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {elections.map(e => (
                  <tr key={e.id}>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{e.id}</td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{e.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{e.endtime}</td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>{e.active ? 'Yes' : 'No'}</td>
                    <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                      <button
                        onClick={() => deleteElection(e.id)}
                        style={{ background: '#e00', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px' }}
                        disabled={e.active}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

