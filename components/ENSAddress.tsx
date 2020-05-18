import React, { useEffect, useState } from "react";
import { useStateValue } from "../State/globalState";
import { resolveAddress, smartTrim } from "../functions";

interface ENSAddressProps {
    address: string
    trim?: number
}

const ENSAddress = (props: ENSAddressProps) => {

    const [{ ensProvider }, dispatch] = useStateValue()
    const { address, trim } = props
    const [ensAddress, setEnsAddress] = useState(undefined)


    useEffect(() => {

        if (!ensProvider) return
        if (!address) return
        if (process.env.NETWORK === "kovan") return;
        resolveName()

    }, [ensProvider])

    async function resolveName() {
        try {
            const resolved = await resolveAddress(ensProvider, address)
            console.log('resolved:', resolved)
            setEnsAddress(resolved)
        } catch (error) {
            setEnsAddress(smartTrim(address, trim ? trim : 12))
        }


    }

    if (!ensProvider || process.env.NETWORK === "kovan") return <div>{smartTrim(address, trim ? trim : 12)}</div>

    return ensAddress ? ensAddress : smartTrim(address, trim ? trim : 12)
}
export default ENSAddress;