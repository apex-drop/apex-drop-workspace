import toast, { Toaster } from 'react-hot-toast'
import { CgSpinner } from 'react-icons/cg'
import { HiCheckCircle } from 'react-icons/hi2'
import { useCallback, useEffect, useState } from 'react'

import AppIcon from './assets/images/icon.png'
import { cn } from './lib/utils'

function ContactLink(props) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'px-2 py-1 text-sm text-white rounded-lg bg-neutral-700 hover:bg-blue-500',
        props.className
      )}
    />
  )
}

function App() {
  const [isRunning, setIsRunning] = useState(null)
  const [addresses, setAddresses] = useState(null)

  const handleStartServer = useCallback(() => {
    toast.promise(
      window.api.startServer().then((addresses) => {
        setIsRunning(true)
        setAddresses(addresses)
      }),
      {
        success: 'Server Started',
        loading: 'Starting...',
        error: 'Failed to Start Server'
      }
    )
  }, [setAddresses, setIsRunning])

  const handleStopServer = useCallback(() => {
    toast.promise(
      window.api.stopServer().then(() => {
        setAddresses(null)
        setIsRunning(false)
      }),
      {
        success: 'Server Stopped',
        loading: 'Stopping...',
        error: 'Failed to Stop Server'
      }
    )
  }, [])

  /** Get Server State */
  useEffect(() => {
    window.api.getServerState().then(({ status, addresses }) => {
      setIsRunning(status)
      setAddresses(addresses)
    })
  }, [setIsRunning, setAddresses])

  return (
    <>
      <div className="flex flex-col justify-center overflow-auto h-dvh">
        <div className="flex flex-col items-center gap-2 p-4 my-2">
          {isRunning !== null ? (
            <>
              <img src={AppIcon} className="w-28 h-28" />

              <h1 className="font-bold">Apex Drop</h1>

              {/* Toggle Button */}
              <button
                className={cn(
                  'px-4 py-1.5 rounded-full text-white',
                  !isRunning ? 'bg-blue-500' : 'bg-red-500'
                )}
                onClick={!isRunning ? handleStartServer : handleStopServer}
              >
                {!isRunning ? 'Start Server' : 'Stop Server'}
              </button>

              {/* Addresses */}
              {addresses ? (
                <div className="flex flex-col w-full gap-2 p-4 my-2 bg-neutral-800 rounded-xl">
                  {addresses.map((address, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <HiCheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-blue-300">{address}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Connect */}
              <div className="flex items-center justify-center gap-2 py-4">
                <ContactLink href="https://apexdrop.com.ng">Website</ContactLink>
                <ContactLink href="https://wa.me/2349018646163">Dev</ContactLink>
                <ContactLink href="https://t.me/Apex_Drop">Channel</ContactLink>
              </div>
            </>
          ) : (
            <CgSpinner className="w-5 h-5 mx-auto animate-spin" />
          )}
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  )
}

export default App
