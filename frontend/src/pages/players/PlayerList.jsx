import React, { useState, useEffect, useMemo } from 'react';
import { useGetPlayersQuery, useDeletePlayerMutation } from '../redux/api/userApiSlice';
import { useNavigate } from 'react-router-dom';
import './PlayerList.css';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PlayerList = () => {
  const { data: players, isLoading, error, refetch } = useGetPlayersQuery();
  const [deletePlayer] = useDeletePlayerMutation();
  const navigate = useNavigate();

  const [loadingScreen, setLoadingScreen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter players by id or name (case-insensitive)
  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    const term = searchTerm.toLowerCase();
    return players.filter(
      p =>
        p.playerId.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term)
    );
  }, [players, searchTerm]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleDownloadPDF = () => {
    if (!players || players.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape' });

    const columns = ['Player ID', 'Name', 'Email', 'Phone', 'Fees', ...months];
    const rows = players.map(player => [
      player.playerId,
      player.name,
      player.email || '',
      player.phone || '',
      player.fees,
      ...months.map(m => player.paymentStatus[m] ? 'Paid' : 'Unpaid'),
    ]);

    const leftMargin = 8;
    doc.text("Players & Monthly Fees", leftMargin, 15);

    autoTable(doc, {
      startY: 20,
      margin: { left: leftMargin },
      head: [columns],
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'ellipsize',
        valign: 'middle',
        halign: 'left',
      },
      headStyles: {
        fillColor: '#007bff',
        textColor: '#fff',
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 15, halign: 'middle' },
        ...months.reduce((acc, _, idx) => {
          acc[idx + 5] = { cellWidth: 15, halign: 'center' };
          return acc;
        }, {}),
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index >= 5) {
          if (data.cell.raw === 'Paid') {
            data.cell.styles.textColor = [0, 128, 0];
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw === 'Unpaid') {
            data.cell.styles.textColor = [255, 0, 0];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    doc.save('players_list.pdf');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await deletePlayer(id).unwrap();
        alert("Player deleted successfully");
        refetch();
      } catch (err) {
        alert("Failed to delete player: " + (err?.data?.message || err.error));
      }
    }
  };

  const onRowClick = (id) => {
    navigate(`/${id}/edit`);
  };

  if (isLoading) return <p className="loading">Loading players...</p>;
  if (error) return <p className="error">Error fetching players</p>;

  return (
    <div className="player-list">
      {loadingScreen && (
        <div className="initial-loading-screen">
          <div className="loader-circle"></div>
          <p className="loading-text">Loading Player List...</p>
        </div>
      )}

      <div className="video-wrapper-pl">
        <video
          autoPlay muted loop
          className="video-background-pl"
          playsInline
          src="/videos/footballer.mp4"
          type="video/mp4"
        />
        <div className="video-overlay-pl"></div>
      </div>

      <h2 className='pl-title'>All Players & Monthly Fees</h2>

      <button className="download-button" onClick={handleDownloadPDF}>Download PDF</button>

      <br />

      <input
        type="text"
        placeholder="Search by Player ID or Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="player-search"
      />

      <div className="player-table-container">
        <table className="player-table">
          <thead>
            <tr>
              <th>Player ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Fees</th>
              {months.map((month) => (
                <th key={month}>{month}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={months.length + 6} style={{ textAlign: 'center' }}>
                  No players found.
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player) => (
                <tr
                  key={player._id}
                  onClick={(e) => {
                    // Avoid navigating when clicking delete button
                    if (e.target.closest('.delete-btn')) return;
                    onRowClick(player._id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{player.playerId}</td>
                  <td>{player.name}</td>
                  <td>{player.email}</td>
                  <td>{player.phone}</td>
                  <td>{player.fees} BD</td>
                  {months.map((month) => (
                    <td
                      key={month}
                      className={player.paymentStatus[month] ? 'paid' : 'unpaid'}
                      style={{ textAlign: 'center' }}
                    >
                      {player.paymentStatus[month] ? '✅' : '❌'}
                    </td>
                  ))}
                  <td>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(player._id);
                      }}
                      title="Delete Player"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerList;
