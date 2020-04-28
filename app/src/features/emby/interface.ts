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


export interface InfoI {
    CachePath: string
    CanLaunchWebBrowser: boolean
    CanSelfRestart: boolean
    CanSelfUpdate: boolean
    CompletedInstallations: string[]
    HardwareAccelerationRequiresPremiere: boolean
    HasPendingRestart: boolean
    HasUpdateAvailable: boolean
    HttpServerPortNumber: number
    HttpsPortNumber: number
    Id: string
    InternalMetadataPath: string
    IsShuttingDown: boolean
    ItemsByNamePath: string
    LocalAddress: string
    LogPath: string
    OperatingSystem: string
    OperatingSystemDisplayName: string
    ProgramDataPath: string
    ServerName: string
    SupportsAutoRunAtStartup: boolean
    SupportsHttps: boolean
    SupportsLibraryMonitor: boolean
    SystemUpdateLevel: string
    TranscodingTempPath: string
    Version: string
    WanAddress: string
    WebSocketPortNumber: number
}

export interface LibraryI {
    BackdropImageTags: string[]
    CanDelete: boolean
    CanDownload: boolean
    ChildCount: string
    CollectionType: string
    DateCreated: string
    DisplayPreferencesId: string
    Etag: string
    ExternalUrls: string[]
    GenreItems: string[]
    Genres: string[]
    Id: string
    ImageTags: {
        Primary: string
    }
    IsFolder: boolean
    LockData: boolean
    LockedFields: string[]
    Name: string
    ParentId: string
    Path: string
    PlayAccess: string
    PresentationUniqueKey: string
    PrimaryImageAspectRatio: number
    ProviderIds: {}
    RemoteTrailers: string[]
    ServerId: string
    SortName: string
    Studios: string[]
    TagItems: string[]
    Taglines: string[]
    Tags: string[]
    Type: string
    UserData: {
        PlaybackPositionTicks: number,
        PlayCount: number,
        IsFavorite: boolean,
        Played: boolean
    }
}

export interface LoadLibrariesI {
    Items: LibraryI[]
    TotalRecordCount: number,
}
