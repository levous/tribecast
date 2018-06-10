export const poll_action_types = {
    REQUEST_API_SYNC: 'POLL/REQUEST_API_SYNC',
    DISPATCH_API_SYNC: 'POLL/DISPATCH_API_SYNC',
    DISPATCH_API_SYNC_FAILED: 'POLL/DISPATCH_API_SYNC_FAILED'
};

export function dispatchApiSync() {
    return { type: poll_action_types.DISPATCH_API_SYNC };
};