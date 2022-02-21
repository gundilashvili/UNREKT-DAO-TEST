import { useState } from "react";
import { Box, Slide } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { Skeleton } from "@material-ui/lab";
import { trim, prettyVestingPeriod } from "../../helpers";
import { messages } from "../../constants/messages";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IReduxState } from "../../store/slices/state.interface";
import { warning } from "../../store/slices/messages-slice";
import { changeAirdrop } from "../../store/slices/airdrop-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";

function Airdrop() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const currentBlockTime = useSelector<IReduxState, number>(state => {
        return state.app.currentBlockTime;
    });

    const claimableBalance = useSelector<IReduxState, string>(state => {
        return state.account.airdrop.claimable;
    });

    const pendingBalance = useSelector<IReduxState, string>(state => {
        return state.account.airdrop.pending;
    });

    const claimedAmount = useSelector<IReduxState, string>(state => {
        return state.account.airdrop.claimed;
    });

    const vestingTerm = useSelector<IReduxState, string>(state => {
        return state.account.airdrop.vesting;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const trimmedClaimableBalance = trim(Number(claimableBalance), 6);
    const trimmedPendingBalance = trim(Number(pendingBalance), 6);
    const trimmedClaimedAmount = trim(Number(claimedAmount), 6);
    const trimmedVestingTerm = prettyVestingPeriod(currentBlockTime, parseInt(vestingTerm));

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

    const onChangeAirdrop = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (claimableBalance === "" || parseFloat(claimableBalance) === 0) {
            dispatch(warning({ text: messages.before_claim_airdrop }));
        } else {
            await dispatch(changeAirdrop({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity("");
        }
    };

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">UNREKT Airdrop</p>
                                <RebaseTimer />
                            </div>
                        </Grid>
                    </Grid>

                    <div className="stake-card-area">
                        {!address && (
                            <div className="stake-card-wallet-notification">
                                <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                    <p>Connect Wallet</p>
                                </div>
                                <p className="stake-card-wallet-desc-text">Connect your wallet to stake UNREKT tokens!</p>
                            </div>
                        )}
                        {address && (
                            <div>
                                <Grid className="stake-card-grid" container direction="column" spacing={2}>
                                    <Grid item>
                                        <Box display="flex" justifyContent="space-around" flexWrap="wrap">
                                            <div
                                                className="transaction-button airdrop-approve-btn"
                                                onClick={() => {
                                                    if (isPendingTxn(pendingTransactions, "staking")) return;
                                                    onChangeAirdrop("claim");
                                                }}
                                            >
                                                <p>{txnButtonText(pendingTransactions, "Claiming", "Claim")}</p>
                                            </div>
                                            <div
                                                className="transaction-button airdrop-approve-btn"
                                                onClick={() => {
                                                    if (isPendingTxn(pendingTransactions, "staking")) return;
                                                    onChangeAirdrop("claimAndAutostake");
                                                }}
                                            >
                                                <p>{txnButtonText(pendingTransactions, "Staking", "Claim And Autostake")}</p>
                                            </div>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <div className="stake-user-data">
                                            <div className="data-row">
                                                <p className="data-row-name">Max Rewards</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(trimmedPendingBalance), 4)} UNREKT</>}</p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">Claimable Rewards</p>
                                                <p className="data-row-value">
                                                    {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(trimmedClaimableBalance), 8)} UNREKT</>}
                                                </p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">Claimed Rewards</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(trimmedClaimedAmount), 8)} UNREKT</>}</p>
                                            </div>
                                            <div className="data-row">
                                                <p className="data-row-name">Time until fully vested</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedVestingTerm}</>}</p>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        )}
                    </div>
                </div>
            </Zoom>
        </div>
    );
}

export default Airdrop;
