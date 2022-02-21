import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, StakingContract, AirdropContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeAirdrop = createAsyncThunk("claim/changeAirdrop", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const airdrop = new ethers.Contract(addresses.AIRDROP_ADDRESS, AirdropContract, signer);
    let claimTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "claimAndAutostake") {
            claimTx = await airdrop.claim(true, { gasPrice });
        } else {
            claimTx = await airdrop.claim(false, { gasPrice });
        }
        const pendingTxnType = action === "claimAndAutostake" ? "staking" : "claiming";
        dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await claimTx.wait();
        dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (claimTx) {
            dispatch(clearPendingTxn(claimTx.hash));
        }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
