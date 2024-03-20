import './App.css';
// import ListRenderer from "./ListRenderer";
import MY_ENDLESS_LIST from './Constants';
import HorizontalSlidingWindowScroll from './HorizontalSlidingWindowScroll';
function App() {
	return (
		<div className='App'>
			<h1>Sliding Window Infinite Scroll</h1>
			<HorizontalSlidingWindowScroll list={MY_ENDLESS_LIST} height={195} />
		</div>
	);
}

export default App;
