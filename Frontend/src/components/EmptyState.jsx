import React from 'react'
import { Button } from 'react-bootstrap'

const EmptyState = ({
    icon,
    title,
    description,
    actionText,
    onAction,
    illustration
}) => {
    return (
        <div className="empty-state-container text-center py-5">
            {illustration ? (
                <div className="empty-state-illustration mb-4">
                    {illustration}
                </div>
            ) : (
                <div className="empty-state-icon mb-4">
                    {icon || '📭'}
                </div>
            )}

            <h4 className="empty-state-title mb-3">
                {title || 'Nothing here yet'}
            </h4>

            <p className="empty-state-description text-muted mb-4">
                {description || 'Start by creating something new!'}
            </p>

            {actionText && onAction && (
                <Button
                    variant="primary"
                    onClick={onAction}
                    className="empty-state-action"
                >
                    {actionText}
                </Button>
            )}

            <style jsx>{`
        .empty-state-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 3rem 1rem;
        }

        .empty-state-icon {
          font-size: 80px;
          opacity: 0.3;
          animation: float 3s ease-in-out infinite;
        }

        .empty-state-illustration {
          max-width: 300px;
          margin: 0 auto;
          opacity: 0.8;
        }

        .empty-state-title {
          color: var(--text-primary);
          font-weight: 600;
        }

        .empty-state-description {
          font-size: 1rem;
          line-height: 1.6;
        }

        .empty-state-action {
          border-radius: 12px;
          padding: 10px 24px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .empty-state-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
        </div>
    )
}

// Pre-configured empty states
export const EmptyPosts = ({ onCreatePost }) => (
    <EmptyState
        icon="📝"
        title="No posts yet"
        description="Be the first to share your thoughts and experiences with the community!"
        actionText="Create Post"
        onAction={onCreatePost}
    />
)

export const EmptyMessages = () => (
    <EmptyState
        icon="💬"
        title="No messages"
        description="Start a conversation with our AI assistant to get help and support."
    />
)

export const EmptySearch = () => (
    <EmptyState
        icon="🔍"
        title="No results found"
        description="Try adjusting your search terms or filters to find what you're looking for."
    />
)

export const EmptyNotifications = () => (
    <EmptyState
        icon="🔔"
        title="No notifications"
        description="You're all caught up! Check back later for updates."
    />
)

export const EmptyNews = () => (
    <EmptyState
        icon="📰"
        title="No news available"
        description="Check back soon for the latest updates and articles."
    />
)

export default EmptyState
