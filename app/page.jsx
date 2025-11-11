"use client"; // <--- 在文件顶部添加这行指令

import '../i18n'; // 将 i18n 的初始化移到这里
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

function HomePage() {
  // 从 useTranslation Hook 中获取 t 函数和 i18n 实例
  const { t, i18n } = useTranslation();

  // 定义一个函数来切换语言
  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const [itemCount, setItemCount] = useState(5);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-gray-50 to-gray-200 p-4 dark:from-gray-900 dark:to-gray-800 sm:p-8">
      <div className="w-full max-w-4xl">
        {/* 欢迎标题和副标题 */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {t('welcomeMessage')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Your centralized hub for learning and actions.
          </p>
        </header>

        {/* 主要内容区域 - 网格布局 */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* 动态内容 */}
          <div className="transform rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800/50 dark:ring-white/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.  75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Dynamic Content
              </h3>
            </div>
            <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">{t('greeting', { name: 'World' })}</p>
              <p className="text-gray-700 dark:text-gray-300">{t('itemCount_plural', { count: itemCount })}</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="transform rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:bg-gray-800/50 dark:ring-white/10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 15.09l-1.813 1.813-1.09-1.09 1.813-1.813L6 12.09l1.813-1.813 1.09 1.09L7.813 12.5l1.09-1.09L9 12.5l1.09-1.09 1.09 1.09-1.813 1.813 1.09 1.09L12 15.09l-1.09 1.09-1.09-1.09z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Actions
              </h3>
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row">
              <button className="w-full transform rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 sm:w-auto">
                {t('buttons.submit')}
              </button>
              <button className="w-full transform rounded-lg bg-gray-200 px-6 py-3 text-base font-semibold text-gray-800 shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 dark:focus:ring-offset-gray-800 sm:w-auto">
                {t('buttons.cancel')}
              </button>
            </div>
          </div>
        </section>

        {/* 语言切换 */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/60 p-1 shadow-inner dark:bg-gray-800/60">
            <button onClick={() => switchLanguage('en')} className="rounded-full px-4 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-white/80 dark:text-gray-300 dark:hover:bg-gray-700/80">English</button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button onClick={() => switchLanguage('zh')} className="rounded-full px-4 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-white/80 dark:text-gray-300 dark:hover:bg-gray-700/80">中文</button>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default HomePage;