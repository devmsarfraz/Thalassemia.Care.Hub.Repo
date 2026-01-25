import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Card } from 'react-bootstrap'

const PostSkeleton = () => {
    return (
        <Card className="fb-card post-card mb-3">
            <div className="fb-card-header justify-content-between">
                <div className="d-flex align-items-center w-100">
                    <Skeleton circle height={40} width={40} className="me-2" />
                    <div className="post-header-info w-75">
                        <h6 className="mb-0"><Skeleton width="150px" /></h6>
                        <small className="text-muted">
                            <Skeleton width="100px" />
                        </small>
                    </div>
                </div>
            </div>

            <div className="fb-card-body">
                <h6 className="mb-2 fw-bold"><Skeleton width="70%" /></h6>
                <div className="post-content">
                    <Skeleton count={3} />
                </div>
            </div>

            <div className="post-stats mt-2">
                <Skeleton width="100px" height={20} />
            </div>

            <div className="post-actions mt-2">
                <Skeleton width="30%" height={30} inline className="me-2" />
                <Skeleton width="30%" height={30} inline className="me-2" />
                <Skeleton width="30%" height={30} inline />
            </div>
        </Card>
    )
}

export default PostSkeleton
