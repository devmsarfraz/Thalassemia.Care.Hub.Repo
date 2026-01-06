import React from 'react'
import { Card, Placeholder } from 'react-bootstrap'

// Skeleton for Card Component
export const SkeletonCard = () => (
    <Card className="border-0 shadow-sm">
        <Card.Body>
            <Placeholder as="div" animation="glow">
                <Placeholder xs={3} className="mb-3" style={{ height: '24px', borderRadius: '8px' }} />
                <Placeholder xs={12} className="mb-2" style={{ height: '16px', borderRadius: '4px' }} />
                <Placeholder xs={8} className="mb-2" style={{ height: '16px', borderRadius: '4px' }} />
                <Placeholder xs={10} style={{ height: '16px', borderRadius: '4px' }} />
            </Placeholder>
        </Card.Body>
    </Card>
)

// Skeleton for Post Component
export const SkeletonPost = () => (
    <Card className="border-0 shadow-sm mb-3">
        <Card.Body>
            <div className="d-flex align-items-center mb-3">
                <Placeholder animation="glow">
                    <Placeholder
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            marginRight: '12px'
                        }}
                    />
                </Placeholder>
                <div className="flex-grow-1">
                    <Placeholder as="div" animation="glow">
                        <Placeholder xs={3} className="mb-1" style={{ height: '16px', borderRadius: '4px' }} />
                        <Placeholder xs={2} style={{ height: '12px', borderRadius: '4px' }} />
                    </Placeholder>
                </div>
            </div>
            <Placeholder as="div" animation="glow">
                <Placeholder xs={12} className="mb-2" style={{ height: '20px', borderRadius: '4px' }} />
                <Placeholder xs={12} className="mb-2" style={{ height: '16px', borderRadius: '4px' }} />
                <Placeholder xs={9} className="mb-2" style={{ height: '16px', borderRadius: '4px' }} />
                <Placeholder xs={11} style={{ height: '16px', borderRadius: '4px' }} />
            </Placeholder>
        </Card.Body>
    </Card>
)

// Skeleton for News Article
export const SkeletonNews = () => (
    <Card className="border-0 shadow-sm h-100">
        <Placeholder animation="glow">
            <Placeholder
                style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '0'
                }}
            />
        </Placeholder>
        <Card.Body>
            <Placeholder as="div" animation="glow">
                <Placeholder xs={4} className="mb-2" style={{ height: '20px', borderRadius: '12px' }} />
                <Placeholder xs={12} className="mb-2" style={{ height: '20px', borderRadius: '4px' }} />
                <Placeholder xs={8} className="mb-3" style={{ height: '20px', borderRadius: '4px' }} />
                <Placeholder xs={12} className="mb-2" style={{ height: '14px', borderRadius: '4px' }} />
                <Placeholder xs={12} className="mb-2" style={{ height: '14px', borderRadius: '4px' }} />
                <Placeholder xs={9} style={{ height: '14px', borderRadius: '4px' }} />
            </Placeholder>
        </Card.Body>
    </Card>
)

// Skeleton for Profile
export const SkeletonProfile = () => (
    <Card className="border-0 shadow-sm">
        <Card.Body className="text-center">
            <Placeholder animation="glow">
                <Placeholder
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        margin: '0 auto 16px'
                    }}
                />
            </Placeholder>
            <Placeholder as="div" animation="glow" className="d-flex flex-column align-items-center">
                <Placeholder xs={4} className="mb-2" style={{ height: '24px', borderRadius: '4px' }} />
                <Placeholder xs={3} className="mb-3" style={{ height: '16px', borderRadius: '4px' }} />
                <Placeholder xs={6} className="mb-2" style={{ height: '14px', borderRadius: '4px' }} />
                <Placeholder xs={5} style={{ height: '14px', borderRadius: '4px' }} />
            </Placeholder>
        </Card.Body>
    </Card>
)

// Skeleton for List Item
export const SkeletonListItem = () => (
    <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
        <Placeholder animation="glow">
            <Placeholder
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    marginRight: '12px'
                }}
            />
        </Placeholder>
        <div className="flex-grow-1">
            <Placeholder as="div" animation="glow">
                <Placeholder xs={8} className="mb-2" style={{ height: '18px', borderRadius: '4px' }} />
                <Placeholder xs={5} style={{ height: '14px', borderRadius: '4px' }} />
            </Placeholder>
        </div>
    </div>
)

export default {
    SkeletonCard,
    SkeletonPost,
    SkeletonNews,
    SkeletonProfile,
    SkeletonListItem
}
