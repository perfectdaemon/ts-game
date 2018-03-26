export enum Keys {
    NoInput = 0,

    LeftButton = 1, RightButton = 2, Cancel = 3, MiddleButton = 4, XButton1 = 5, XButton2 = 6,

    Back = 8, Tab = 9,

    Clear = 12, Return = 13,

    Shift = 16, Ctrl = 17, Alt = 18, Pause = 19, CapsLock = 20,

    Escape = 27,

    Space = 32, PageUp = 33, PageDown = 34,
    End, Home, Left, Up, Right, Down,

    PrintScreen = 44, Insert, Delete,

    _0 = 48, _1, _2, _3, _4, _5, _6, _7, _8, _9,
    A = 65, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z,

    LeftWin = 91, RightWin, Select,

    NumPad0 = 96, NumPad1, NumPad2, NumPad3, NumPad4, NumPad5, NumPad6, NumPad7, NumPad8, NumPad9,
    NumPadMul, NumPadAdd, NumPadSeparator, NumPadSub, NumPadDecimal, NumPadDiv,

    F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24,

    NumLock = 144, ScrollLock,

    WheelUp = 151, WheelDown, // engine defined, according to win api reference these codes are not assigned

    Semicolon = 186, Equal, Comma, Dash, Period, ForwardSlash, GraveAccent,

    OpenBracket = 219, BackSlash, CloseBracket, SingleQuote,
}

export type MouseButtons = Keys.LeftButton | Keys.RightButton | Keys.MiddleButton;
