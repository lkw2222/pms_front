import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SimpleChat = () => {
    const [messages, setMessages] = useState([]); // 받은 메시지 목록
    const [inputValue, setInputValue] = useState(''); // 입력창 상태
    const [isConnected, setIsConnected] = useState(false); // 연결 상태

    // 컴포넌트가 다시 렌더링되어도 클라이언트 객체를 유지하기 위해 useRef 사용
    const clientRef = useRef(null);

    // 1. 컴포넌트가 켜질 때(마운트) 소켓 연결
    useEffect(() => {
        // Spring Boot 서버 주소 설정 (백엔드 설정에 맞춰 변경하세요)
        const serverUrl = 'http://localhost:8080/ws';

        const client = new Client({
            // Spring Boot에서 SockJS를 사용할 경우 아래 방식 사용
            webSocketFactory: () => new SockJS(serverUrl),

            // 만약 SockJS 없이 순수 WebSocket을 쓴다면 아래처럼 브로커 URL 지정
            // brokerURL: 'ws://localhost:8080/ws',

            reconnectDelay: 5000, // 연결이 끊어지면 5초마다 재연결 시도

            // 연결 성공 시 실행되는 콜백
            onConnect: () => {
                console.log('STOMP 연결 성공!');
                setIsConnected(true);

                // 2. 특정 채널(Topic) '구독(Subscribe)'하기
                // 이 경로로 들어오는 메시지는 모두 onMessageReceived 함수가 받습니다.
                client.subscribe('/topic/public', (message) => {
                    // 받은 메시지는 문자열이므로 JSON으로 파싱
                    const receivedData = JSON.parse(message.body);

                    // 기존 메시지 목록에 새 메시지 추가
                    setMessages((prev) => [...prev, receivedData]);
                });
            },

            // 연결 실패 또는 끊김 시 실행
            onDisconnect: () => {
                console.log('STOMP 연결 끊김!');
                setIsConnected(false);
            },

            // 에러 로깅용
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        // 클라이언트 활성화 (실제 연결 시도)
        client.activate();
        clientRef.current = client;

        // 컴포넌트가 꺼질 때(언마운트) 연결 해제 (메모리 누수 방지)
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    // 3. 서버로 메시지 '발행(Publish)'하기
    const sendMessage = (e) => {
        e.preventDefault();

        if (clientRef.current && isConnected && inputValue.trim() !== '') {
            // 보낼 데이터 객체 (백엔드의 DTO 구조와 맞춰야 합니다)
            const chatMessage = {
                sender: '사용자1', // 실제로는 로그인한 유저명
                content: inputValue,
                type: 'CHAT'
            };

            // 서버의 /app/chat.sendMessage 경로로 메시지 전송
            clientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });

            setInputValue(''); // 입력창 비우기
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', width: '400px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ marginTop: 0 }}>
                실시간 알림 테스트
                <span style={{ color: isConnected ? 'green' : 'red', fontSize: '12px', marginLeft: '10px' }}>
          {isConnected ? '🟢 연결됨' : '🔴 끊김'}
        </span>
            </h3>

            {/* 메시지 표시 영역 */}
            <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
                {messages.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>메시지가 없습니다.</p>}
            </div>

            {/* 입력 영역 */}
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    disabled={!isConnected}
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <button
                    type="submit"
                    disabled={!isConnected}
                    style={{ padding: '8px 16px', backgroundColor: isConnected ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: isConnected ? 'pointer' : 'not-allowed' }}
                >
                    전송
                </button>
            </form>
        </div>
    );
};

export default SimpleChat;