import { createSyncServer } from 'apex-drop-server-core'

let sync = null

/** Start Server */
export function startSyncServer() {
  return new Promise((resolve, reject) => {
    createSyncServer()
      .then((data) => {
        /** Store Server */
        sync = data

        /** Resolve Addresses */
        resolve(sync.addresses)
      })
      .catch(() => reject({ status: false }))
  })
}

/** Close Server */
export function stopSyncServer() {
  if (sync) {
    sync.server.close()
    sync = null
  }
}

/** Get Server State */
export function getSyncServerState() {
  return {
    status: sync !== null,
    addresses: sync?.addresses
  }
}
