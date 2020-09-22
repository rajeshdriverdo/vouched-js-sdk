import {Job, VouchedSession} from "@vouched.id/vouched-js";

export const setJobAction = (job: Job) => ({
    type:'SET_JOB',
    payload: job
});

export const setSessionAction = (session: VouchedSession) => ({
    type:'SET_SESSION',
    payload: session
});
