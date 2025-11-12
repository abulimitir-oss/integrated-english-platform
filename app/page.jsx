"use client"; // <--- 在文件顶部添加这行指令

function HomePage() {
  // 内容现在由 MainPage.tsx 和 LoginPage.tsx 控制
  return (
    // 这个页面现在是空的，因为 MainPage 会根据登录状态显示登录页或主应用
    null
  );
}

export default HomePage;