import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility)
        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="scroll-to-top-btn"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}

            <style jsx>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          z-index: 1000;
          transition: all 0.3s ease;
          animation: fadeIn 0.3s ease-in;
        }

        .scroll-to-top-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .scroll-to-top-btn:active {
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .scroll-to-top-btn {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }
      `}</style>
        </>
    )
}

export default ScrollToTop
