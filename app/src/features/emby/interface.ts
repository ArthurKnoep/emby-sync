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

export interface ItemI {
    BackdropImageTags: string[]
    Id: string
    ImageTags: {
        Primary: string
    }
    IndexNumber?: number
    IsFolder: boolean
    MediaType: string
    Name: string
    ParentBackdropImageTags?: string[]
    ParentBackdropItemId?: string
    ParentIndexNumber?: number
    ParentThumbImageTag?: string
    ParentThumbItemId?: string
    PrimaryImageAspectRatio: number
    ProductionYear: number
    RunTimeTicks: number
    SeasonId?: string
    SeasonName?: string
    SeriesId?: string
    SeriesName?: string
    SeriesPrimaryImageTag?: string
    ServerId: string
    SupportsSync: boolean
    Type: 'Movie' | 'Episode' | 'Series'
    UserData: {
        IsFavorite: boolean
        LastPlayedDate: string
        PlayCount: number
        PlaybackPositionTicks: number
        Played: boolean
        PlayedPercentage?: number
        UnplayedItemCount?: number
    }
}

export interface LoadItemsI {
    Items: ItemI[]
    TotalRecordCount: number
}

export interface FullItemI {
    Name: string;
    ServerId: string;
    Id: string;
    Etag: string;
    DateCreated: string;
    CanDelete: boolean;
    CanDownload: boolean;
    PresentationUniqueKey: string;
    SupportsSync: boolean;
    Container: string;
    SortName: string;
    PremiereDate: string;
    ExternalUrls: {
        Name: string;
        Url: string;
    }[];
    MediaSources: {
        Protocol: string;
        Id: string;
        Path: string;
        Type: string;
        Container: string;
        Size: number;
        Name: string;
        IsRemote: boolean;
        RunTimeTicks: number;
        SupportsTranscoding: boolean;
        SupportsDirectStream: boolean;
        SupportsDirectPlay: boolean;
        IsInfiniteStream: boolean;
        RequiresOpening: boolean;
        RequiresClosing: boolean;
        RequiresLooping: boolean;
        SupportsProbing: boolean;
        MediaStreams: {
            Codec: string;
            TimeBase: string;
            CodecTimeBase: string;
            VideoRange?: string;
            DisplayTitle: string;
            NalLengthSize?: string;
            IsInterlaced: boolean;
            IsAVC?: boolean;
            BitRate?: number;
            BitDepth?: number;
            RefFrames?: number;
            IsDefault: boolean;
            IsForced: boolean;
            Height?: number;
            Width?: number;
            AverageFrameRate?: number;
            RealFrameRate?: number;
            Profile?: string;
            Type: string;
            AspectRatio?: string;
            Index: number;
            IsExternal: boolean;
            IsTextSubtitleStream: boolean;
            SupportsExternalStream: boolean;
            Protocol: string;
            PixelFormat?: string;
            Level?: number;
            IsAnamorphic?: boolean;
            Language?: string;
            Title?: string;
            DisplayLanguage?: string;
            ChannelLayout?: string;
            Channels?: number;
            SampleRate?: number;
        }[];
        Formats?: (null)[];
        Bitrate: number;
        RequiredHttpHeaders: {};
        ReadAtNativeFramerate: boolean;
        DefaultAudioStreamIndex: number;
        DefaultSubtitleStreamIndex: number;
    }[];
    Path: string;
    Taglines?: [];
    Genres?: string[];
    RunTimeTicks: number;
    PlayAccess: string;
    ProductionYear: number;
    IndexNumber: number;
    ParentIndexNumber: number;
    RemoteTrailers?: [];
    ProviderIds: {
        Tvdb: string;
        Imdb: string;
    };
    IsFolder: boolean;
    ParentId: string;
    Type: string;
    People?: {
        Name: string;
        Id: string;
        Type: string;
    }[];
    Studios?: [];
    GenreItems?: {
        Name: string;
        Id: number;
    }[];
    TagItems?: [];
    ParentLogoItemId: string;
    ParentBackdropItemId: string;
    ParentBackdropImageTags?: string[];
    UserData: {
        PlayedPercentage: number;
        PlaybackPositionTicks: number;
        PlayCount: number;
        IsFavorite: boolean;
        LastPlayedDate: string;
        Played: boolean;
    };
    SeriesName: string;
    SeriesId: string;
    SeasonId: string;
    DisplayPreferencesId: string;
    Tags?: [];
    PrimaryImageAspectRatio: number;
    SeriesPrimaryImageTag: string;
    SeasonName: string;
    MediaStreams: {
        Codec: string;
        TimeBase: string;
        CodecTimeBase: string;
        VideoRange?: string;
        DisplayTitle: string;
        NalLengthSize?: string;
        IsInterlaced: boolean;
        IsAVC?: boolean;
        BitRate?: number;
        BitDepth?: number;
        RefFrames?: number;
        IsDefault: boolean;
        IsForced: boolean;
        Height?: number;
        Width?: number;
        AverageFrameRate?: number;
        RealFrameRate?: number;
        Profile?: string;
        Type: string;
        AspectRatio?: string;
        Index: number;
        IsExternal: boolean;
        IsTextSubtitleStream: boolean;
        SupportsExternalStream: boolean;
        Protocol: string;
        PixelFormat?: string;
        Level?: number;
        IsAnamorphic?: boolean;
        Language?: string;
        Title?: string;
        DisplayLanguage?: string;
        ChannelLayout?: string;
        Channels?: number;
        SampleRate?: number;
    }[];
    ImageTags: {
        Primary: string;
    };
    BackdropImageTags?: [];
    ParentLogoImageTag: string;
    ParentThumbItemId: string;
    ParentThumbImageTag: string;
    Chapters?: {
        StartPositionTicks: number;
        Name: string;
    }[];
    MediaType: string;
    LockedFields?: [];
    LockData: boolean;
    Width: number;
    Height: number;
}

export interface ProfileI {
    DeviceProfile: {
        MaxStaticBitrate: number;
        MaxStreamingBitrate: number;
        MusicStreamingTranscodingBitrate: number;
        DirectPlayProfiles?: {
            Container: string;
            Type: string;
            VideoCodec?: string;
            AudioCodec?: string;
        }[];
        TranscodingProfiles?: {
            Container: string;
            Type: string;
            AudioCodec: string;
            Context: string;
            Protocol?: string;
            MaxAudioChannels?: string;
            MinSegments?: string | null;
            BreakOnNonKeyFrames?: boolean;
            VideoCodec?: string;
            CopyTimestamps?: boolean;
            ManifestSubtitles?: string;
        }[];
        ContainerProfiles?: [];
        CodecProfiles?: {
            Type: string;
            Codec?: string;
            Conditions?: {
                Condition: string;
                Property: string;
                Value: string;
                IsRequired: string | boolean;
            }[];
        }[];
        SubtitleProfiles?: {
            Format: string;
            Method: string;
        }[];
        ResponseProfiles?: {
            Type: string;
            Container: string;
            MimeType: string;
        }[];
    };
}

export interface PlaybackInfoI {
    MediaSources?: {
        Protocol: string;
        Id: string;
        Path: string;
        Type: string;
        Container: string;
        Size: number;
        Name: string;
        IsRemote: boolean;
        RunTimeTicks: number;
        SupportsTranscoding: boolean;
        SupportsDirectStream: boolean;
        SupportsDirectPlay: boolean;
        IsInfiniteStream: boolean;
        RequiresOpening: boolean;
        RequiresClosing: boolean;
        RequiresLooping: boolean;
        SupportsProbing: boolean;
        MediaStreams?: {
            Codec: string;
            TimeBase: string;
            CodecTimeBase: string;
            VideoRange?: string;
            DisplayTitle: string;
            NalLengthSize?: string;
            IsInterlaced: boolean;
            IsAVC?: boolean;
            BitRate?: number;
            BitDepth?: number;
            RefFrames?: number;
            IsDefault: boolean;
            IsForced: boolean;
            Height?: number;
            Width?: number;
            AverageFrameRate?: number;
            RealFrameRate?: number;
            Profile?: string;
            Type: string;
            AspectRatio?: string;
            Index: number;
            IsExternal: boolean;
            IsTextSubtitleStream: boolean;
            SupportsExternalStream: boolean;
            Protocol: string;
            PixelFormat?: string;
            Level?: number;
            IsAnamorphic?: boolean;
            Language?: string;
            Title?: string;
            DisplayLanguage?: string;
            ChannelLayout?: string;
            Channels?: number;
            SampleRate?: number;
            DeliveryMethod?: string;
            DeliveryUrl?: string;
            IsExternalUrl?: boolean;
        }[];
        Formats?: [];
        Bitrate: number;
        RequiredHttpHeaders: {};
        DirectStreamUrl: string;
        ReadAtNativeFramerate: boolean;
        DefaultAudioStreamIndex: number;
        DefaultSubtitleStreamIndex: number;
    }[];
    PlaySessionId: string;
}

