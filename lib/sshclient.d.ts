interface NativeEvent {
    name: string;
    key: string;
    value: any;
}
export declare enum PtyType {
    VANILLA = "vanilla",
    VT100 = "vt100",
    VT102 = "vt102",
    VT220 = "vt220",
    ANSI = "ansi",
    XTERM = "xterm"
}
declare type CBError = any;
export declare type CallbackFunction<T> = (error: CBError, response?: T) => void;
export declare type EventHandler = (value: any) => void;
export interface LsResult {
    filename: string;
    isDirectory: boolean;
    modificationDate: string;
    lastAccess: string;
    fileSize: number;
    ownerUserID: number;
    ownerGroupID: number;
    flags: number;
}
export interface KeyPair {
    privateKey: string;
    publicKey?: string;
    passphrase?: string;
}
export declare type PasswordOrKey = string | KeyPair;
/**
 * Manage a connection to an SSH Server
 *
 * Instances of SSHClient are created using the following factory functions:
 * - SSHClient.connectWithKey()
 * - SSHClient.connectWithPassword()
 */
export default class SSHClient {
    /** Connect using a key.
     *
     * @param privateKey
     * The private key, in OpenSSH format.
     * Only support RSA, DSA, ECDSA
     *
     * @param passphrase
     * Passphrase to unlock the private key. Can be omitted.
     *
     * Return a promise that resolve when the connection is established.
     * privateKey is a string.
     */
    static connectWithKey(host: string, port: number, username: string, privateKey: string, passphrase?: string, callback?: CallbackFunction<SSHClient>): Promise<SSHClient>;
    /** Connect using a password */
    static connectWithPassword(host: string, port: number, username: string, password: string, callback: CallbackFunction<SSHClient>): Promise<SSHClient>;
    /** "unique" key to identify callback from native library */
    private _key;
    private _listeners;
    private _counters;
    private _activeStream;
    private _handlers;
    private host;
    private port;
    private username;
    /**
     * Generic constructor
     *
     * Should not be called directly; use factory functions instead.
     */
    constructor(host: string, port: number, username: string, passwordOrKey: PasswordOrKey, callback: CallbackFunction<void>);
    /**
     * Return a random client key.
     *
     * This key is used to identify which callback match with which instance.
     */
    static _getRandomClientKey(): string;
    /**
     * Callback used to dispatch events
     */
    _handleEvent(event: NativeEvent): void;
    /**
     * Register an event handler
     */
    on(eventName: string, handler: EventHandler): void;
    /**
     * Register this instance to handle a native event
     *
     * @param eventName
     * Name of the event. Must match when calling unregisterNativeListener()
     */
    _registerNativeListener(eventName: string): void;
    /**
     * Unregister a native event listener
     *
     * @param eventName
     * Must match the value from registerNativeListener()
     */
    _unregisterNativeListener(eventName: string): void;
    /**
     * Perform actual connection to server.
     * Called automatically by constructor.
     */
    _connect(passwordOrKey: PasswordOrKey, callback: CallbackFunction<void>): void;
    /**
     * Execute a command on the remote server
     *
     * @param command
     * Command to execute, as a string
     *
     * @return
     * A promise
     */
    execute(command: string, callback?: CallbackFunction<string>): Promise<string>;
    /**
     * Open a shell on the remote.
     *
     * You must handle the "Shell" events to get the shell outputs.
     *
     * @param {string} ptyType
     * vanilla, vt100, vt102, vt220, ansi, xterm
     *
     * @return
     * A Promise that resolve with the initial output
     */
    startShell(ptyType: PtyType, callback?: CallbackFunction<string>): Promise<string>;
    /**
     * Make sure that a shell connection is open
     */
    _checkShell(callback?: CallbackFunction<string>): Promise<string>;
    /**
     * Send some input to the server
     *
     * @return
     * A promise with the immediate reply
     */
    writeToShell(command: string, callback?: CallbackFunction<string>): Promise<string>;
    /**
     * Close the open shell connection
     */
    closeShell(): void;
    /**
     * Open an SFTP connection on the server
     *
     * It is not mandatory to call this method before calling any SFTP method.
     *
     * @return
     * A promise
     */
    connectSFTP(callback?: CallbackFunction<void>): Promise<void>;
    /**
     * Make sure an SFTP connection is open
     *
     * @return
     * A promise
     */
    _checkSFTP<ResultType>(callback?: CallbackFunction<ResultType>): Promise<void>;
    /**
     * List a directory content on the server
     *
     * @param path
     * The path to list
     *
     * @return
     * A promise with the file listing as an object.
     */
    sftpLs(path: string, callback: CallbackFunction<LsResult>): Promise<LsResult>;
    /**
     * Rename a file on the server
     *
     * @return
     * A promise
     */
    sftpRename(oldPath: string, newPath: string, callback: CallbackFunction<void>): Promise<void>;
    /**
     * Create a directory on the server
     *
     * @return
     * A promise
     */
    sftpMkdir(path: string, callback: CallbackFunction<void>): Promise<void>;
    /**
     * Unlink a file on the server
     *
     * @return
     * A promise
     */
    sftpRm(path: string, callback: CallbackFunction<void>): Promise<void>;
    /**
     * Remove a directory from the server
     *
     * @return
     * A promise
     */
    sftpRmdir(path: string, callback: CallbackFunction<void>): Promise<void>;
    /**
     * chmod a path on the remote
     *
     * Only available on Android
     *
     * @return
     * A promise
     */
    sftpChmod(path: string, permissions: number, callback: CallbackFunction<void>): Promise<void>;
    /**
     * Upload a file
     *
     * @param localFilePath
     * Path to the source file on the filesystem
     *
     * @param remoteFilePath
     * Path for the file on the remote server
     *
     * @return
     * A promise
     */
    sftpUpload(localFilePath: string, remoteFilePath: string, callback: CallbackFunction<void>): Promise<void>;
    /**
     * Cancel a pending upload
     */
    sftpCancelUpload(): void;
    /**
     * Download a file from the server
     *
     * @param remoteFilePath
     * Path to the file on the remote server
     *
     * @param localFilePath
     * Path to the file on the local filesystem
     *
     * @return
     * A promise
     */
    sftpDownload(remoteFilePath: string, localFilePath: string, callback?: CallbackFunction<string>): Promise<string>;
    /**
     * Cancel a pending download
     */
    sftpCancelDownload(): void;
    /**
     * Close an open SFTP connection on the remote server
     */
    disconnectSFTP(): void;
    /**
     * Close an open SSH connection on the remote server
     */
    disconnect(): void;
}
export {};
//# sourceMappingURL=sshclient.d.ts.map