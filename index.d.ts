
declare module 'ipfs-repo' {

  import { Key, Datastore } from 'interface-datastore'

  interface Options {
    /**
     * controls automatic migrations of repository.
     * @default true
     */
    autoMigrate?: boolean;
    /**
     * what type of lock to use.
     * Lock has to be acquired when opening.
     * @deprecated
     */
    lock?: 'fs' | 'memory';
    /**
     * optional,
     * may contain the following values, which should each be a class implementing the datastore interface
     */
    storageBackends?: {
      /**
       * Defines the back-end type used for gets and puts of values at the root (repo.set(), repo.get()).
       * (defaults to datastore-fs in Node.js and datastore-level in the browser).
       */
      root?: any;
      /**
       * Defines the back-end type used for gets and puts of values at repo.blocks.
       * (defaults to datastore-fs in Node.js and datastore-level in the browser).
       */
      blocks?: any;
      /**
       * Defines the back-end type used for gets and puts of encrypted keys at repo.keys.
       * (defaults to datastore-fs in Node.js and datastore-level in the browser).
       */
      keys?: any;
      /**
       * Defines the back-end type used as the key-value store used for gets and puts of values at repo.datastore.
       * (defaults to datastore-level).
       */
      datastore?: any;
    };
  }

  export default class Repo {
    /**
     * Creates an IPFS Repo.
     * @param path the path for this repo
     * @param options optional
     */
    constructor(path: string, options?: Options);

    readonly path: string;

    readonly options: Options;

    /**
     * Creates the necessary folder structure inside the repo.
     */
    init(config: object): Promise<void>;

    /**
     * The returned promise resolves to false if the repo has not been initialized and true if it has.
     */
    isInitialized(): Promise<boolean>;

    /**
     * Tells whether this repo exists or not.
     */
    exists(): Promise<boolean>;

    /**
     * Locks the repo to prevent conflicts arising from simultaneous access.
     */
    open(): Promise<void>;

    /**
     * Unlocks the repo.
     */
    close(): Promise<void>;

    readonly closed: boolean;

    /**
     * Tells whether this repo exists or not.
     */
    exists(): Promise<boolean>;

    /**
     * Put a value at the root of the repo.
     */
    put(key: string | Buffer | Key, value: Buffer): Promise<void>;

    /**
     * Get a value at the root of the repo.
     */
    get(key: string | Buffer | Key): Promise<Buffer>;

    readonly blocks: {
      /**
       * @param block should be of type [Block](https://github.com/ipfs/js-ipfs-block#readme).
       */
      put(block: any): Promise<void>;

      /**
       * Put many blocks.
       * @param blocks should be an Iterable or AsyncIterable that yields entries of type [Block](https://github.com/ipfs/js-ipfs-block#readme).
       */
      putMany(blocks: Iterable<any> | AsyncIterable<any>): Promise<void>;

      /**
       * Get block.
       * @param cid is the content id of [type CID](https://github.com/ipld/js-cid#readme).
       */
      get(cid): Promise<any>;
    }

    /**
     * This contains a full implementation of the [interface-datastore API](https://github.com/ipfs/interface-datastore#api).
     */
    readonly datastore: Datastore;

    /**
     * Instead of using repo.set('config'),
     * this exposes an API that allows you to set and get a decoded config object, as well as, in a safe manner, change any of the config values individually.
     */
    readonly config: {
      /**
       * Set a config value.
       * @param key key is a string specifying the object path
       * @param value can be any object that is serializable to JSON.
       */
      set(key: string, value: object): Promise<void>;

      /**
       * Set the whole config value. 
       * @param value can be any object that is serializable to JSON.
       */
      set(value: object): Promise<void>;

      /**
       * Get a config value.
       * Returned promise resolves to the same type that was set before.
       * @param key is a string specifying the object path.
       */
      get(key: string): Promise<object>;

      /**
       * Get the entire config value.
       */
      get(): Promise<object>;

      /**
       * Whether the config sub-repo exists.
       */
      exists(): Promise<boolean>;
    }

    readonly version: {
      /**
       * Gets the repo version (an integer).
       */
      get(): Promise<number>;

      /**
       * Sets the repo version
       */
      set(version: Number): Promise<void>;
    }

    readonly apiAddr: {
      /**
       * Gets the API address.
       */
      get(): Promise<string>;

      /**
       * Sets the API address.
       * @param value should be a Multiaddr or a String representing a valid one.
       */
      set(value): Promise<void>;
    }

    stat(): Promise<object>
  }

}
