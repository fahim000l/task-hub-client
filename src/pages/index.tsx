import Image from "next/image";
import { Inter } from "next/font/google";
import Main from "@/layout/Main";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Main>
      <div>Hwllow World</div>
    </Main>
  );
}
