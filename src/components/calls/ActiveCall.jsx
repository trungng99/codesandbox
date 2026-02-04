// src/components/calls/ActiveCall.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, 
  FiUsers, FiUserPlus, FiMaximize2, FiMessageSquare,
  FiMoreVertical, FiShare2, FiVolume2, FiVolumeX
} from 'react-icons/fi';

const ActiveCall = ({ callData, onEndCall, onMinimize }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participants, setParticipants] = useState(callData.participants || []);
  const [showParticipants, setShowParticipants] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callContainerRef = useRef(null);

  // Mock participants data
  const mockParticipants = [
    { id: 1, name: 'Nguyễn Văn A', avatar: 'NA', isSpeaking: true, videoEnabled: true },
    { id: 2, name: 'Trần Thị B', avatar: 'TB', isSpeaking: false, videoEnabled: false },
    { id: 3, name: 'Lê Văn C', avatar: 'LC', isSpeaking: true, videoEnabled: true },
    { id: 4, name: 'Bạn', avatar: 'ME', isSpeaking: true, videoEnabled: true, isLocal: true },
  ];

  // Handle toggle mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // In real app: mute/unmute local audio track
  };

  // Handle toggle video
  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // In real app: enable/disable local video track
  };

  // Handle screen share
  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        // In real app: get screen share stream
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      // Stop screen sharing
      setIsScreenSharing(false);
    }
  };

  // Handle toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      callContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle end call
  const handleEndCall = () => {
    // In real app: close all connections
    onEndCall();
  };

  // Handle add participant
  const handleAddParticipant = () => {
    // In real app: open modal to add more participants
    alert('Chức năng thêm người tham gia đang được phát triển');
  };

  // Initialize call (mock)
  useEffect(() => {
    // In real app: initialize WebRTC connection
    console.log('Initializing call:', callData);
    
    // Mock: set participants
    setParticipants(mockParticipants);
    
    // Mock: simulate incoming chat messages
    const mockMessages = [
      { id: 1, sender: 'Nguyễn Văn A', text: 'Xin chào mọi người!', time: '10:30' },
      { id: 2, sender: 'Trần Thị B', text: 'Chào anh A, tôi có thể nghe rõ', time: '10:31' },
      { id: 3, sender: 'Lê Văn C', text: 'Mọi người có thể thấy slide của tôi không?', time: '10:32' },
    ];
    setChatMessages(mockMessages);

    return () => {
      // Cleanup
      console.log('Cleaning up call');
    };
  }, [callData]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`active-call-container ${isFullscreen ? 'fullscreen' : ''}`} ref={callContainerRef}>
      {/* Call header */}
      <div className="call-header">
        <div className="call-info">
          <div className="call-title">
            {callData.title}
          </div>
          <div className="call-duration">
            00:05:24
          </div>
        </div>
        <div className="call-actions">
          <button 
            className="call-action-btn"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            <FiMaximize2 />
          </button>
          <button 
            className="call-action-btn"
            onClick={onMinimize}
            title="Thu nhỏ"
          >
            <FiMoreVertical />
          </button>
        </div>
      </div>

      {/* Main call content */}
      <div className="call-content">
        {/* Video grid */}
        <div className="video-grid">
          {participants.map((participant, index) => (
            <div 
              key={participant.id} 
              className={`video-tile ${participant.isSpeaking ? 'speaking' : ''} ${participant.isLocal ? 'local' : ''}`}
            >
              {participant.videoEnabled ? (
                <div className="video-container">
                  <video 
                    ref={participant.isLocal ? localVideoRef : remoteVideoRef}
                    className="video-element"
                    autoPlay
                    muted={participant.isLocal}
                  />
                  <div className="video-overlay">
                    <div className="participant-info">
                      <div className="participant-avatar">
                        {participant.avatar}
                      </div>
                      <div className="participant-name">
                        {participant.name} {participant.isLocal && '(Bạn)'}
                      </div>
                    </div>
                    {participant.isSpeaking && (
                      <div className="speaking-indicator">
                        <div className="speaking-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-video">
                  <div className="no-video-avatar">
                    {participant.avatar}
                  </div>
                  <div className="no-video-name">
                    {participant.name} {participant.isLocal && '(Bạn)'}
                  </div>
                  <div className="no-video-status">
                    {participant.isSpeaking ? 'Đang nói...' : 'Đã tắt camera'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side panels */}
        <div className="call-side-panels">
          {/* Participants panel */}
          {showParticipants && (
            <div className="participants-panel">
              <div className="panel-header">
                <h4>
                  <FiUsers />
                  Người tham gia ({participants.length})
                </h4>
                <button 
                  className="panel-toggle"
                  onClick={() => setShowParticipants(false)}
                >
                  ✕
                </button>
              </div>
              <div className="participants-list">
                {participants.map(participant => (
                  <div key={participant.id} className="participant-item">
                    <div className="participant-avatar">
                      {participant.avatar}
                      <span className={`participant-status ${participant.isSpeaking ? 'speaking' : 'listening'}`}></span>
                    </div>
                    <div className="participant-details">
                      <div className="participant-name">
                        {participant.name} {participant.isLocal && '(Bạn)'}
                      </div>
                      <div className="participant-status-text">
                        {participant.isSpeaking ? 'Đang nói' : 'Đang nghe'}
                      </div>
                    </div>
                    <div className="participant-actions">
                      {participant.isLocal ? (
                        <>
                          <button className="action-btn" title={isMuted ? 'Bật mic' : 'Tắt mic'}>
                            {isMuted ? <FiMicOff /> : <FiMic />}
                          </button>
                          <button className="action-btn" title={isVideoOff ? 'Bật camera' : 'Tắt camera'}>
                            {isVideoOff ? <FiVideoOff /> : <FiVideo />}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="action-btn" title="Điều chỉnh âm lượng">
                            <FiVolume2 />
                          </button>
                          <button className="action-btn" title="Tùy chọn">
                            <FiMoreVertical />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="add-participant-btn"
                onClick={handleAddParticipant}
              >
                <FiUserPlus />
                Thêm người tham gia
              </button>
            </div>
          )}

          {/* Chat panel */}
          {showChat && (
            <div className="chat-panel">
              <div className="panel-header">
                <h4>
                  <FiMessageSquare />
                  Chat
                </h4>
                <button 
                  className="panel-toggle"
                  onClick={() => setShowChat(false)}
                >
                  ✕
                </button>
              </div>
              <div className="chat-messages">
                {chatMessages.map(message => (
                  <div key={message.id} className="call-chat-message">
                    <div className="message-sender">{message.sender}</div>
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">{message.time}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input 
                  type="text" 
                  placeholder="Nhập tin nhắn..." 
                  className="chat-input-field"
                />
                <button className="chat-send-btn">Gửi</button>
              </div>
            </div>
          )}

          {/* Panel toggles */}
          <div className="panel-toggles">
            {!showParticipants && (
              <button 
                className="panel-toggle-btn"
                onClick={() => setShowParticipants(true)}
                title="Hiển thị người tham gia"
              >
                <FiUsers />
                <span className="participant-count">{participants.length}</span>
              </button>
            )}
            {!showChat && (
              <button 
                className="panel-toggle-btn"
                onClick={() => setShowChat(true)}
                title="Mở chat"
              >
                <FiMessageSquare />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Call controls */}
      <div className="call-controls">
        <div className="control-group">
          <button 
            className={`control-btn ${isMuted ? 'active' : ''}`}
            onClick={handleToggleMute}
            title={isMuted ? 'Bật mic' : 'Tắt mic'}
          >
            {isMuted ? <FiMicOff /> : <FiMic />}
            <span className="control-label">{isMuted ? 'Bật mic' : 'Tắt mic'}</span>
          </button>
          
          <button 
            className={`control-btn ${isVideoOff ? 'active' : ''}`}
            onClick={handleToggleVideo}
            title={isVideoOff ? 'Bật camera' : 'Tắt camera'}
          >
            {isVideoOff ? <FiVideoOff /> : <FiVideo />}
            <span className="control-label">{isVideoOff ? 'Bật camera' : 'Tắt camera'}</span>
          </button>
          
          <button 
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={handleScreenShare}
            title={isScreenSharing ? 'Dừng chia sẻ màn hình' : 'Chia sẻ màn hình'}
          >
            <FiShare2 />
            <span className="control-label">{isScreenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}</span>
          </button>
        </div>

        <div className="control-group center">
          <button 
            className="control-btn end-call"
            onClick={handleEndCall}
            title="Kết thúc cuộc gọi"
          >
            <FiPhoneOff />
            <span className="control-label">Kết thúc</span>
          </button>
        </div>

        <div className="control-group">
          <button 
            className="control-btn"
            onClick={() => setShowChat(!showChat)}
            title={showChat ? 'Đóng chat' : 'Mở chat'}
          >
            <FiMessageSquare />
            <span className="control-label">Chat</span>
          </button>
          
          <button 
            className="control-btn"
            onClick={handleAddParticipant}
            title="Thêm người tham gia"
          >
            <FiUserPlus />
            <span className="control-label">Thêm người</span>
          </button>
          
          <button 
            className="control-btn"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            <FiMaximize2 />
            <span className="control-label">{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCall;