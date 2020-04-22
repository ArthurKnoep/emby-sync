export interface LoginInfoI {
    AccessToken: string
    User: {
        Id: string;
        Name: string;
        DisplayName: string;
        Email: string;
        IsActive: string;
        ImageUrl: string | null;
        IsSupporter: string | null;
        ExpDate: string | null;
    };
}

export interface ServerI {
    Id: string;
    Url: string;
    Name: string;
    SystemId: string;
    AccessKey: string;
    LocalAddress: string;
    UserType: string;
    SupporterKey: string;
}

export interface PingServerI {
    Id: string;
    LocalAddress: string;
    ServerName: string;
    Version: string;
    WanAddress: string;
}

export interface ExchangeI {
    AccessToken: string
    LocalUserId: string
}
