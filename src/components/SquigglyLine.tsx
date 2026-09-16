/*
 ** SquigglyLine
 */

export const SquigglyLine = () => (
    <>
        <svg width="300" height="40" viewBox="0 0 300 40" className="mt-[1rem]">
            <path
                d="M10 20 Q20 5 30 20 T50 20 T70 20 T90 20 T110 20 T130 20 T150 20 T170 20 T190 20 T210 20 T230"
                stroke="#F59E0B"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
            />
        </svg>
    </>
);
