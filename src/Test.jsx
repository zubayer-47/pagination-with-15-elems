import { useEffect, useRef, useState } from 'react';

const Test = () => {
	const [count, setCount] = useState(0);
	const prevCountRef = useRef(count);

	useEffect(() => {
		// Access previous state using prevCountRef.current
		console.log('Previous count:', prevCountRef.current);
		console.log('Current count:', count);
	}, [count]);

	const handleIncrement = () => {
		setCount((prev) => {
			prevCountRef.current = prev;

			return prev + 1;
		});
	};

	return (
		<div>
			<button type='button' onClick={handleIncrement}>
				Increment
			</button>
		</div>
	);
};

export default Test;
