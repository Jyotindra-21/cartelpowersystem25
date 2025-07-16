'use client'
import { useEffect, useRef, useState } from 'react'


const ScrollLine = () => {

    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [viewBox, setViewBox] = useState('0 0 900 2000');
    // To hide line before page load
    const [visible, setVisible] = useState(false);

    const scroll = () => {
        const svg = svgRef.current;
        const path = pathRef.current;

        if (!svg || !path) return;

        const distance = window.scrollY;
        const totalDistance = svg.clientHeight - window.innerHeight;
        const percentage = distance / totalDistance;
        const pathLength = path.getTotalLength();

        path.style.strokeDasharray = `${pathLength}`;
        path.style.strokeDashoffset = `${pathLength * (1 - percentage)}`;

        // If the scroll position reaches the end, set the final state of the animation
        if (percentage >= 1) {
            // Set dash offset to 0 to show entire path
            path.style.strokeDashoffset = '0';

            // Disable transition to prevent resetting
            path.style.transition = 'none';

        } else {
            path.style.transition = ''; // Re-enable transition
        }
    };

    useEffect(() => {
        scroll();
        window.addEventListener('scroll', scroll);
        //Set visible when scroll
        setVisible(true)

        return () => {
            window.removeEventListener('scroll', scroll);
        };
    }, []);

    useEffect(() => {
        const updateViewBox = () => {
            if (window.innerWidth < 768) {
                setViewBox('0 0 350 1800'); // for small/mobile screens
            } else {
                setViewBox('0 0 900 2000'); // for medium and larger screens
            }
        };

        updateViewBox(); // set initially
        window.addEventListener('resize', updateViewBox); // listen for changes
        return () => window.removeEventListener('resize', updateViewBox); // cleanup
    }, []);


    return (
        <div className={visible ? 'block' : 'hidden'}>
            <svg
                ref={svgRef}
                viewBox={viewBox}
                // viewBox="0 0 900 2000"
                // viewBox="0 0 350 1800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="squiggle absolute top-[0vh] left-0 w-full h-full lg:h-[320vh] md:h-[300vh]  lg:-rotate-[3deg] md:-rotate-[2deg] -rotate-[2deg] z-0 opacity-90"
            >
                <path
                    d="M-24.5 101C285 315 5.86278 448.291 144.223 631.238C239.404 757.091 559.515 782.846 608.808 617.456C658.101 452.067 497.627 367.073 406.298 426.797C314.968 486.521 263.347 612.858 322.909 865.537C384.086 1125.06 79.3992 1007.94 100 1261.99C144.222 1807.35 819 1325 513 1142.5C152.717 927.625 -45 1916.5 991.5 1890"
                    ref={pathRef}
                    strokeWidth="15"
                    // stroke="#FF5E0E"
                    stroke="#fad000"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    )
}

export default ScrollLine