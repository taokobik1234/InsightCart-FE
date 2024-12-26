import { useState, useEffect } from "react";
import {
    BsFillArrowRightCircleFill,
    BsFillArrowLeftCircleFill,
} from "react-icons/bs";
import e1 from "../assets/e1.jpg"
import e2 from "../assets/e2.jpg"
import e3 from "../assets/e3.jpg"
const slides = [
    e3, e2, e1
];
export default function CarouselComponent() {
    let [current, setCurrent] = useState(0);
    let previousSlide = () => {
        if (current === 0) setCurrent(slides.length - 1);
        else setCurrent(current - 1);
    };

    let nextSlide = () => {
        if (current === slides.length - 1) setCurrent(0);
        else setCurrent(current + 1);
    };
    useEffect(() => {
        const autoSlide = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => clearInterval(autoSlide);
    }, [nextSlide]);


    return (
        <div className="overflow-hidden relative">
            <div
                className={`flex transition ease-out duration-40`}
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {slides.map((s, i) => {
                    return <img src={s} key={i} alt="image1" />;
                })}
            </div>

            <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
                <button onClick={previousSlide}>
                    <BsFillArrowLeftCircleFill size={20} />
                </button>
                <button onClick={nextSlide}>
                    <BsFillArrowRightCircleFill size={20} />
                </button>
            </div>

            <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
                {slides.map((s, i) => {
                    return (
                        <div
                            onClick={() => {
                                setCurrent(i);
                            }}
                            key={"circle" + i}
                            className={`rounded-full w-2 h-2 cursor-pointer  ${i === current ? "bg-white" : "bg-gray-500"
                                }`}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}