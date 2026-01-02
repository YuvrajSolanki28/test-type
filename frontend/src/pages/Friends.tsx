import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Send, Check, X } from 'lucide-react';
import axios from 'axios';

interface Friend {
    _id: string;
    username: string;
}

interface FriendRequest {
    _id: string;
    requester: { username: string };
}

export function Friends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [friendsRes, requestsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/friends`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/friends/requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setFriends(friendsRes.data);
            setRequests(requestsRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async () => {
        if (!username.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/friends/request`, 
                { username },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsername('');
            alert('Friend request sent!');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Failed to send request');
            } else {
                alert('Failed to send request');
            }
        }
    };

    const handleRequest = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/friends/request/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            loadData();
        } catch {
            alert('Failed to handle request');
        }
    };

    const createRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/multiplayer/room`,
                { difficulty: 'medium' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { roomId } = response.data;
            window.location.href = `/multiplayer/${roomId}`;
        } catch {
            alert('Failed to create room');
        }
    };

    if (loading) return <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-linear-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f] text-white">
            <div className="max-w-4xl mx-auto px-6 py-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Friends
                    </h1>
                    <p className="text-white/60 mb-12">Connect and compete with friends</p>
                </motion.div>

                {/* Add Friend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <UserPlus className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold">Add Friend</h2>
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            onKeyPress={(e) => e.key === 'Enter' && sendRequest()}
                        />
                        <button
                            onClick={sendRequest}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Request
                        </button>
                    </div>
                </motion.div>

                {/* Friend Requests */}
                {requests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Friend Requests</h2>
                            <button
                                onClick={loadData}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors text-sm"
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div key={request._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <span>{request.requester.username}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRequest(request._id, 'accepted')}
                                            className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRequest(request._id, 'declined')}
                                            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Friends List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="w-6 h-6 text-green-400" />
                        <h2 className="text-2xl font-bold">Friends ({friends.length})</h2>
                    </div>

                    {friends.length === 0 ? (
                        <p className="text-white/60 text-center py-8">No friends yet. Add some friends to start playing together!</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {friends.map((friend) => (
                                <div key={friend._id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                    <span className="font-medium">{friend.username}</span>
                                    <button
                                        onClick={() => createRoom()}
                                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm"
                                    >
                                        Challenge
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
