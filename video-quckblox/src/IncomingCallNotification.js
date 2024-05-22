import React from "react";

function IncomingCallNotification({ callerName, onAccept, onReject }) {
  return (
    <div className="incoming-call-notification">
      <p>Incoming call from {callerName}</p>
      <button onClick={onAccept}>Accept</button>
      <button onClick={onReject}>Reject</button>
    </div>
  );
}

export default IncomingCallNotification;
