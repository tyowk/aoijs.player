export enum PlayerEvents {
    TrackStart = 'trackStart',
    TrackEnd = 'trackEnd',
    QueueEnd = 'queueEnd'
}

export enum PlayerEventsBefore {
    trackStart = 'playerStart',
    trackEnd = 'playerFinish',
    queueEnd = 'queueDelete'
}

export enum ArgType {
    String = 0,
    Void = 1,
    Number = 2,
    Boolean = 3,
    Object = 4,
    Array = 5
}
