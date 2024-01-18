import React from 'react';
const { api } = window;

const PrintButton = () => {
  const handlePrint = () => {
    // ipcRenderer.send('print-to-pdf'); // Send a message to the main process to trigger printing
    api.showNotification('print-to-pdf')
  };

  return (
    <div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default PrintButton;