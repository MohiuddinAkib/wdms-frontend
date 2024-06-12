import { useGetWalletListQuery } from "@/hooks/wallet";

function HomePage() {
  const { data: wallets, isPending } = useGetWalletListQuery();

  return <div>HomePage</div>;
}

export default HomePage;
