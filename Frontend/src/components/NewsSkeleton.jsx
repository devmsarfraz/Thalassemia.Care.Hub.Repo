import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Card } from 'react-bootstrap'

const NewsSkeleton = ({ variant = 'card' }) => {
    if (variant === 'sidebar') {
        return (
            <div className="mb-3">
                <div className="bg-white d-block p-2 rounded shadow-sm">
                    <strong><Skeleton width="80%" /></strong>
                    <div className="mt-1">
                        <Skeleton width="40%" height={15} />
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'hero') {
        return (
            <div className="news-hero" style={{ backgroundColor: '#f0f0f0', minHeight: '400px' }}>
                <Skeleton height={400} />
            </div>
        )
    }

    // Default card variant
    return (
        <div className="news-card">
            <div className="news-card-image-wrapper">
                <Skeleton height="100%" style={{ minHeight: '200px' }} />
            </div>
            <div className="news-card-body">
                <h3 className="news-card-title"><Skeleton count={2} /></h3>

                <div className="news-card-meta mb-3">
                    <Skeleton width={100} className="me-2" />
                    <Skeleton width={80} />
                </div>

                <p className="news-card-excerpt">
                    <Skeleton count={3} />
                </p>

                <div className="news-card-footer mt-auto">
                    <div className="news-card-author">
                        <Skeleton circle width={24} height={24} className="me-2" />
                        <Skeleton width={100} />
                    </div>
                    <Skeleton width={80} height={20} />
                </div>
            </div>
        </div>
    )
}

export default NewsSkeleton
