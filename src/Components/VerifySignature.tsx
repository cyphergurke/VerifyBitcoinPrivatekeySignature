import React, { useState } from 'react'
import useSWR from 'swr';
import bitcoinMessage from 'bitcoinjs-message';
import './style.css';


export const VerifySignature = () => {

    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [ishidden, setIsHidden] = useState(true);

    const addressBalanceFetcher = async (address: string) => {
        if (!address) {
            return {};
        }
        const res = await fetch(`https://blockstream.info/api/address/${address}`);
        return await res.json();
    };

    const { data, error }: { data?: any, error?: any } = useSWR(`${address}`, addressBalanceFetcher);


    const verify = () => {
        setIsHidden(false);
        setIsVerified(false);
        const verified = bitcoinMessage.verify(message, address, signature, undefined, true);
        setIsVerified(verified);
        setIsHidden(false);
    };

    return (
        <>
            <div className='container'>


                <div className='signatureForm' >
                    <div >
                        <input
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    {data?.chain_stats && (
                        <span>address has <i>{(data?.chain_stats?.funded_txo_sum - data?.chain_stats?.spent_txo_sum) / 100000000} BTC</i></span>
                    )}

                    <div>
                        <textarea
                            value={message}
                            placeholder='Message'
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            value={signature}
                            placeholder='Signature'
                            onChange={(e) => setSignature(e.target.value)}
                        />
                    </div>
                    <button type='submit' onClick={() => verify()} > Verify Message </button>
                </div>

                <div hidden={ishidden}>
                    {isVerified && (
                        <h2>Signature verified!</h2>
                    ) || (
                            <h2>Signatur ist ungültig!</h2>
                        )}
                </div>
            </div>
        </>
    )
} 