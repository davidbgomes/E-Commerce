import React from 'react'

const IsDevContext = React.createContext(true)

export const IsDevProvider = IsDevContext.Provider
export const IsDevConsumer = IsDevContext.Consumer

export default IsDevContext