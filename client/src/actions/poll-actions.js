export const poll_action_types = {
    POLL_START: 'POLL_START',
    POLL_STOP : 'POLL_STOP',
    DISPATCH_API_SYNC: 'POLL/DISPATCH_API_SYNC',
    DISPATCH_API_SYNC_FAILED: 'POLL/DISPATCH_API_SYNC_FAILED',
    SET_POLL_FREQUENCY_SECONDS: 'POLL/SET_POLL_FREQUENCY_SECONDS'
};

export function dispatchApiSync(){
    return { type: poll_action_types.DISPATCH_API_SYNC };
}

export function apiSyncFailure(error){
    return { type: poll_action_types.DISPATCH_API_SYNC_FAILED, error };
}

export function startPolling() {
    return { type: poll_action_types.POLL_START };
};

export function stopPolling() {
    return { type: poll_action_types.POLL_START };
};

export function setPollFrequency(seconds) {
    return { type: poll_action_types.SET_POLL_FREQUENCY_SECONDS, seconds };
};