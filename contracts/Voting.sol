//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
contract Voting {
    //announcment of candidate
    struct Candidate {
        uint id;
        string name;
        uint vCount;
    }
    // announcement of election
    struct Election {
        uint id;
        string name;
        bool isActive;
        uint endtime;
        mapping(uint => Candidate) candidates;
        uint candCount;
        mapping(address => bool) hasVoted;
        uint totalVotes;
    }

    uint public electionCount;
    address public admin;
    //uint public  winner ;
    // uint public mxvote;
    mapping(uint => Election) public elections;
    event electionCreated(uint indexed eid, string indexed name, uint endTime);
    event candidateAdded(uint indexed eid, uint indexed cid, string name);
    event votecast(uint indexed eid, uint indexed cid);
    event electionEnded(
        uint eid,
        uint winner_id,
        string winner_name,
        uint voteCount
    );
    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin can access it");
        _;
    }
    modifier electionExists(uint eid) {
        require(eid > 0 && electionCount >= eid, "election does not exists");
        _;
    }
    modifier electionActive(uint eid) {
        require(elections[eid].isActive == true, "election is not active");
        require(
            elections[eid].endtime >= block.timestamp,
            "election ended already"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }
    function createElection(
        string memory name,
        uint duration
    ) public onlyAdmin {
        electionCount++;
        Election storage e = elections[electionCount];
        e.id = electionCount;
        e.name = name;
        e.isActive = true;
        e.endtime = block.timestamp + duration; //duration will be in second
        e.totalVotes = 0;
        emit electionCreated(e.id, e.name, e.endtime);
    }
    function addCandidate(
        uint eid,
        string memory name
    ) external onlyAdmin electionActive(eid) electionExists(eid) {
        Election storage e = elections[eid];
        uint cid = ++e.candCount;
        e.candidates[cid] = Candidate(cid, name, 0);
        emit candidateAdded(eid, cid, name);
    }
    function vote(
        uint eid,
        uint cid
    ) public electionActive(eid) electionExists(eid) {
        Election storage e = elections[eid];
        require(e.hasVoted[msg.sender] == false, "can vote only once");
        require(e.candCount >= cid && cid > 0, "invalid candidate id");
        e.totalVotes++;
        e.hasVoted[msg.sender] = true;
        e.candidates[cid].vCount++;
        emit votecast(eid, cid);
    }
    function endElection(uint eid) public onlyAdmin electionExists(eid) {
        Election storage e = elections[eid];
        //require(block.timestamp>=e.endtime,"Too early");
        require(e.isActive == true, "election is already ended");
        e.isActive = false;

        uint winnerId;
        uint mxvote = 0;
        for (uint i = 1; i <= e.candCount; i++) {
            if (mxvote < e.candidates[i].vCount) {
                mxvote = e.candidates[i].vCount;
                winnerId = i;
            }
        }
        emit electionEnded(eid, winnerId, e.candidates[winnerId].name, mxvote);
    }
    function getCandidate(
        uint eid,
        uint cid
    )
        public
        view
        electionExists(eid)
        onlyAdmin
        electionActive(eid)
        returns (uint, string memory, uint)
    {
        Election storage e = elections[eid];
        Candidate memory cand = e.candidates[cid];
        return (cid, cand.name, cand.vCount);
    }
    function getWinner(
        uint eid
    ) public view returns (uint, string memory, uint) {
        Election storage e = elections[eid];
        uint winnerId;
        uint mxvote = 0;
        for (uint i = 1; i <= e.candCount; i++) {
            if (mxvote < e.candidates[i].vCount) {
                mxvote = e.candidates[i].vCount;
                winnerId = i;
            }
        }

        return (winnerId, elections[eid].candidates[winnerId].name, mxvote);
    }
}
