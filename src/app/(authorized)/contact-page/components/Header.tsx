import Profile from "@/components/atoms/Profile";

export default function ContactNavbar() {
  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b-2 border-[#9b5de5] bg-[#6f2dbd]/80 px-6 py-3 backdrop-blur-md">
      {/* 左边 Contact */}
      <h1 className="text-2xl font-bold text-white">Contact</h1>

      {/* 右边 Profile 组件 */}
      <Profile username="Jack Stuart" />
    </nav>
  );
}
