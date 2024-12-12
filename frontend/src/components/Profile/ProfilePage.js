import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../components/store/AuthContext';
import FormModal from '../Modal/FormModal';
import './ProfilePage.css';
import '../../App.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('checkTransaction');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [fraudScore, setFraudScore] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const [flaggedCount, setFlaggedCount] = useState(0); // Add state to track flagged transactions count
  const [currentFlaggedCount, setCurrentFlaggedCount] = useState(null); // Track the current flagged transaction being viewed

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleFormSubmit = (data, result) => {
    setTransactionData(data);
    const prediction = result.predictions[0];
    const score = result.probabilities[0][prediction];
    setFraudScore(score);
    setPrediction(prediction);
    if (prediction === 1) {
      setFlaggedCount(prevCount => prevCount + 1);
      setCurrentFlaggedCount(flaggedCount + 1); // Set the current flagged count
    }
  };

  const handleAccept = () => {
    if (transactionData && fraudScore !== null && prediction === 1) {
      setAllTransactions((prevTransactions) => [
        ...prevTransactions,
        { ...transactionData, fraudScore, flaggedNumber: currentFlaggedCount },
      ]);
      setTransactionData(null);
      setFraudScore(null);
      setPrediction(null);
      setCurrentFlaggedCount(null); // Reset current flagged count
      setActiveSection('allTransactions'); // Navigate to All Transactions section
    } else {
      alert("Only flagged transactions can be accepted.");
    }
  };

  const handleDeny = () => {
    setTransactionData(null);
    setFraudScore(null);
    setPrediction(null);
    setCurrentFlaggedCount(null); // Reset current flagged count
  };

  const handleViewDetails = (transaction) => {
    setExpandedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setExpandedTransaction(null);
  };

  const renderSection = () => {
    if (activeSection === 'checkTransaction') {
      return (
        <div className="transaction-section">
          {currentFlaggedCount !== null ? (
            <p>Flagged Transactions #{currentFlaggedCount}</p>
          ) : (
            <p>No flagged transactions</p>
          )}
          <div className="previous-transactions">
            <h4>PREVIOUS TRANSACTIONS</h4>
            {transactionData ? (
              <>
                <div className="transaction-item">
                  <h4>Name:</h4>
                  <p>{transactionData.name[0]}</p>
                </div>

                <div className="transaction-item">
                  <h4>Category:</h4>
                  <p>{transactionData.category[0]}</p>
                </div>
                <div className="transaction-item">
                  <h4>Gender:</h4>
                  <p>{transactionData.gender[0]}</p>
                </div>
                <div className="transaction-item">
                  <h4>State:</h4>
                  <p>{transactionData.state[0]}</p>
                </div>
                <div className="transaction-item">
                  <h4>Job:</h4>
                  <p>{transactionData.job[0]}</p>
                </div>
                <div className="transaction-item">
                  <h4>City Population:</h4>
                  <p>{transactionData.city_pop[0]}</p>
                </div>
                <div className="transaction-item">
                  <h4>Age:</h4>
                  <p>{transactionData.age[0]}</p>
                </div>
                <div className="transaction-item">
                  <h4>Amount:</h4>
                  <p>{transactionData.amt[0]}</p>
                </div>
              </>
            ) : (
              <p>EMPTY</p>
            )}
          </div>
          <div className="fraud-score">
            <h4>ACCURACY SCORE:</h4>
            <div className={`score-circle ${prediction === 0 ? 'green' : 'red'}`}>
              <p>{fraudScore !== null ? fraudScore.toFixed(2) : 'N/A'}</p>
            </div>
          </div>
          <div className="action-buttons">
            <button className="deny-button" onClick={handleDeny}>DENY</button>
            <button className="accept-button" onClick={handleAccept}>ACCEPT</button>
          </div>
        </div>
      );
    } else if (activeSection === 'allTransactions') {
      return (
        <div className="transaction-section">
          <p>All Transactions</p>
          <div className="all-transactions">
            {allTransactions.length > 0 ? (
              allTransactions.map((transaction, index) => (
                <div key={index} className="transaction-row">
                  <div className="transaction-grid">
                    <div className="transaction-item">
                      <h4>Transaction Id:</h4>
                      <p>{transaction.flaggedNumber}</p>
                    </div>
                    <div className="transaction-item">
                      <h4>Name:</h4>
                      <p>{transaction.name[0]}</p>
                    </div>
                    <div className="transaction-item">
                      <h4>Amount:</h4>
                      <p>{transaction.amt[0]}</p>
                    </div>
                    <div className="transaction-item">
                      <h4>Accuracy Score:</h4>
                      <p>{transaction.fraudScore.toFixed(2)}</p>
                    </div>
                    <button
                      className="toggle-button"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      VIEW
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No transactions available</p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <button
          className={`sidebar-button ${activeSection === 'checkTransaction' ? 'active' : ''}`}
          onClick={() => setActiveSection('checkTransaction')}
        >
          CHECK TRANSACTION
        </button>
        <button
          className={`sidebar-button ${activeSection === 'allTransactions' ? 'active' : ''}`}
          onClick={() => setActiveSection('allTransactions')}
        >
          ALL TRANSACTIONS
        </button>
      </div>
      <div className="content">
        {renderSection()}
        {activeSection === 'checkTransaction' && (
          <button onClick={() => setIsModalOpen(true)} className="open-modal-button">Open Form</button>
        )}
      </div>
      <button onClick={handleLogout} className="sign-out-button">SIGN OUT</button>
      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleFormSubmit} />
      {expandedTransaction && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>Close</button>
            <h2>Transaction Details</h2>
            <div className="transaction-grid">
              <div className="transaction-item">
                <h4>Name:</h4>
                <p>{expandedTransaction.name[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>Category:</h4>
                <p>{expandedTransaction.category[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>Amount:</h4>
                <p>{expandedTransaction.amt[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>Accuracy Score:</h4>
                <p>{expandedTransaction.fraudScore.toFixed(2)}</p>
              </div>
              <div className="transaction-item">
                <h4>Gender:</h4>
                <p>{expandedTransaction.gender[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>State:</h4>
                <p>{expandedTransaction.state[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>Job:</h4>
                <p>{expandedTransaction.job[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>City Population:</h4>
                <p>{expandedTransaction.city_pop[0]}</p>
              </div>
              <div className="transaction-item">
                <h4>Age:</h4>
                <p>{expandedTransaction.age[0]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
