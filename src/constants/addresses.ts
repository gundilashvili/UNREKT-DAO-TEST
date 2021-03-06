import { Networks } from "./blockchain";

const AVAX_MAINNET = {
    DAO_ADDRESS: "0x323a4320E33D20ab3C90CAE6d06B49d39f69c304", //"0x78a9e536EBdA08b5b9EDbE5785C9D1D50fA3278C",
    MEMO_ADDRESS: "0xeB95ddAED79806bad1c3e21582A5475977f1A1eb", //"0x136Acd46C134E8269052c62A67042D6bDeDde3C9",
    TIME_ADDRESS: "0x69E021C93100F78A1Bb1be6E504e01D89167Ed53", //"0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
    MIM_ADDRESS: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    STAKING_ADDRESS: "0x658e4E8496Ec355794F538825651001807585D84", //"0x4456B87Af11e87E329AB7d7C7A246ed1aC2168B9",
    STAKING_HELPER_ADDRESS: "0x581CbDA22e403F09f06c9cD35711664AbC778915", //"0x096BBfB78311227b805c968b070a81D358c13379",
    TIME_BONDING_CALC_ADDRESS: "0xd488a2514fa7A02421742a8cdE4D9a26Bc780E30", //"0x819323613AbC79016f9D2443a65E9811545382a5",
    TREASURY_ADDRESS: "0x969B20975a0c244325Ee54d0336F743B4e43b6B1", //"0x1c46450211CB2646cc1DA3c5242422967eD9e04c",
    ZAPIN_ADDRESS: "0x9ABE63C5A2fBcd54c8bAec3553d326356a530cae", //-------------"0xb98007C04f475022bE681a890512518052CE6104",
    WMEMO_ADDRESS: "0xC9521aA2f964bc26ec5A8661879aC24791816E73", //"0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b",
    AIRDROP_ADDRESS: "0x3167678EB0D15B7Fe89Db08e1349222A281CB48f",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.AVAX) return AVAX_MAINNET;

    throw Error("Network don't support");
};
