/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
const THRESHOLD = 15;

const HorizontalSlidingWindowScroll = ({ list, height }) => {
	// const [start, setStart] = useState(0);
	// const [end, setEnd] = useState(THRESHOLD);

	const [state, setState] = useState({
		start: 0,
		end: THRESHOLD,
	});

	const topElement = useRef(null);
	const bottomElement = useRef(null);
	const observerRef = useRef(null);
	const prevStateRef = useRef(state);

	useEffect(() => {
		intiateScrollObserver();
	}, []);

	useEffect(() => {
		const prevState = prevStateRef.current;

		if (prevState.end !== state.end || prevState.start !== state.start) {
			intiateScrollObserver();
		}
	}, [state.end, state.start]);

	const getReference = (index, isLastIndex) => {
		if (index === 0) return topElement;
		if (isLastIndex) return bottomElement;
		return null;
	};

	/**
	 *
	 * * I have to know the length count of list;
	 */

	const callback = (entries) => {
		entries.forEach((entry) => {
			const listLength = list.length;
			const { start, end } = state;
			// Scroll Down
			// We make increments and decrements in 10s
			if (entry.isIntersecting && entry.target.id === 'bottom') {
				// console.log('end :', end);
				const maxStartIndex = listLength - 1 - THRESHOLD; // Maximum index value `start` can take
				// console.log('maxStartIndex :', maxStartIndex);
				const maxEndIndex = listLength; // Maximum index value `end` can take
				// console.log('maxEndIndex :', maxEndIndex);
				const newEnd = end + 10 <= maxEndIndex ? end + 10 : maxEndIndex;
				const newStart = end - 5 <= maxStartIndex ? end - 5 : maxStartIndex;

				// console.log({ newStart, newEnd });
				updateState(newStart, newEnd);
			}
			// Scroll up
			if (entry.isIntersecting && entry.target.id === 'top') {
				const newEnd =
					end === THRESHOLD
						? THRESHOLD
						: end - 10 > THRESHOLD
						? end - 10
						: THRESHOLD;
				let newStart = start === 0 ? 0 : start - 10 > 0 ? start - 10 : 0;
				// console.log({ newStart, newEnd });

				updateState(newStart, newEnd);
			}
		});
	};

	const intiateScrollObserver = () => {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		};
		observerRef.current = new IntersectionObserver(callback, options);
		if (topElement.current) {
			observerRef.current.observe(topElement.current);
			// console.log(topElement.current, 'top');
		}
		if (bottomElement.current) {
			// console.log(bottomElement.current, 'bottom');
			observerRef.current.observe(bottomElement.current);
		}
	};

	const resetObservation = () => {
		// console.log(bottomElement.current, 'bottom');

		observerRef.current.unobserve(bottomElement.current);
		observerRef.current.unobserve(topElement.current);

		topElement.current = null;
		bottomElement.current = null;
	};

	const updateState = (newStart, newEnd) => {
		const { start, end } = state;

		if (start !== newStart || end !== newEnd) {
			resetObservation();

			setState((prev) => {
				prevStateRef.current = prev;

				return {
					start: newStart,
					end: newEnd,
				};
			});
		}
	};

	// eslint-disable-next-line react/prop-types
	const updatedList = list.slice(state.start, state.end);

	console.log({ ...state });

	// console.log(list.slice(28, 44));

	/**
	 * times: start , end
	 * 1st: 	0 	,  15
	 * 2nd: 	10 	,  25 	// gap -> 15
	 * 3nd: 	20 	,  35 	// gap -> 15
	 * 4nd: 	28 	,  44 	// because of 30 is greater than 28 and 28 + 15 = 43 and in this case we could have more than 15 in last page
	 */

	const lastIndex = updatedList.length - 1;

	return (
		<ul
			style={{ position: 'relative' }}
			className='flex gap-10 w-[60rem] mx-auto overflow-x-auto'
		>
			{updatedList.map((item, index) => {
				const top = height * (index + state.start) + 'px';
				const refVal = getReference(index, index === lastIndex);
				const id = index === 0 ? 'top' : index === lastIndex ? 'bottom' : '';
				return (
					<li
						className='bg-blue-400 px-28 py-20 text-4xl'
						key={item.key}
						style={{ left: top }}
						ref={refVal}
						id={id}
					>
						{item.value}
					</li>
				);
			})}
		</ul>
	);
};

export default HorizontalSlidingWindowScroll;
