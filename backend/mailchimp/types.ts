export type SubscriberStatus =
    | 'subscribed'
    | 'unsubscribed'
    | 'cleaned'
    | 'pending'
    | 'transactional';

export type SetListMemberRequest = {
    email_address: string;
    status_if_new: SubscriberStatus;
    status?: SubscriberStatus;
    ip_signup?: string;
};

export type SetListMemberResponse = {
    id: string;
    email_address: string;
    unique_email_id: string;
    status: SubscriberStatus;
};

export type GetListResponse = {
    name: string,
    subscribe_url_long: string,
    subscribe_url_short: string
}
