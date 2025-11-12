'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/shared/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleStartFreeLearning = async () => {
        if (!nickname.trim()) {
            setError('닉네임을 입력해주세요.');
            return;
        }

        setError('');
        setIsSigningIn(true);

        try {
            await login(nickname.trim());
        } catch (e) {
            // 在这种模拟模式下，我们不期望有错误，但保留以防万一
            console.error("Simulated login failed:", e);
            setIsSigningIn(false);
        }
        // 成功后，父组件将自动切换视图，所以这里不需要 setIsSigningIn(false)
    };

    return (
        <div className="flex flex-col items-center min-h-screen pt-12 pb-8 px-4 bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-600 font-['Inter']" style={{
            // @ts-ignore
            '--tw-float-duration': '4s',
            '--tw-float-intensity': 'translateY(-8px)',
            '--tw-float-animation': 'float var(--tw-float-duration) ease-in-out infinite'
        }}>
            <style>
                {`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: var(--tw-float-intensity);
                    }
                }
                .animate-float {
                    animation: var(--tw-float-animation);
                }
                `}
            </style>
            
            <div className="w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl text-center backdrop-blur-sm bg-opacity-95 mt-10">
                
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center shadow-lg">
                        <svg 
                            className="w-16 h-16 text-white animate-float" 
                            fill="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 3L1 9l11 6 11-6-11-6zm-1 10.33V21h2v-7.67l-1-0.5-1 0.5zM3.98 9.25L12 13.5l8.02-4.25L12 5.01l-8.02 4.24z"/>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-violet-700 mt-4">
                        English Platform
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        (AI와 함께 유창한 영어 학습)
                    </p>
                </div>
                
                <button
                    onClick={handleStartFreeLearning}
                    disabled={!nickname.trim() || isSigningIn}
                    className="w-full py-4 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-100 mt-6"
                >
                    {isSigningIn ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            진입 중...
                        </div>
                    ) : '무료로 시작하기'}
                </button>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <label htmlFor="nickname" className="block text-xs font-medium text-gray-700 mb-1 text-left">
                        닉네임 입력 (학습 기록 저장을 위해 사용):
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        placeholder="예: 영어마스터, Joy, 학습 도우미"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-shadow text-base shadow-inner"
                        maxLength={15}
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center text-left p-3 bg-fuchsia-50 rounded-xl border border-fuchsia-200 shadow-sm">
                        <span className="text-2xl mr-3" role="img" aria-label="Sparkles">✨</span>
                        <div>
                            <p className="font-semibold text-fuchsia-800">완전 무료!</p>
                            <p className="text-sm text-fuchsia-700">로그인/회원가입 없이 바로 시작하세요.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center text-left">
                        <span className="text-2xl mr-3 text-red-500" role="img" aria-label="Pencil">🎓</span>
                        <p className="text-gray-700">AI 기반 쓰기 및 말하기 보조</p>
                    </div>
                    <div className="flex items-center text-left">
                        <span className="text-2xl mr-3 text-blue-500" role="img" aria-label="Rocket">🚀</span>
                        <p className="text-gray-700">즉시 사용 가능, 편리한 조작</p>
                    </div>
                    <div className="flex items-center text-left">
                        <span className="text-2xl mr-3 text-pink-500" role="img" aria-label="Heart">💖</span>
                        <p className="text-gray-700">평생 무료, 지속적인 업데이트</p>
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-sm mt-4 font-semibold">{error}</p>}
            </div>
            
            <p className="text-xs text-white text-opacity-80 mt-6">English Platform v1.0 | 2025</p>
        </div>
    );
}