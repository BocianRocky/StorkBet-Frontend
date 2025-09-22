import SideBar from "../components/layout/SideBar";
import BetSlip from "../components/layout/BetSlip";
import MainContent from "../components/layout/MainContent";

const Home = () => {
	return (
		<div className="w-full">
			<div className="mx-auto grid grid-cols-[16rem,1fr,24rem] gap-4 h-[calc(100vh-4rem)]">
				<div className="text-white bg-neutral-950 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto rounded-lg scrollbar-dark">
					<SideBar/>
				</div>
				<div className="min-w-0 overflow-hidden py-4">
					<MainContent/>
				</div>
				<div className="bg-neutral-950 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto rounded-lg scrollbar-dark">
					<BetSlip/>
				</div>
			</div>
		</div>
	);
}
export default Home;