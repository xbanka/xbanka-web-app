import AxiosInstance from "../AxiosInstance/AxiosInstance";
import {
  AddTrustedWalletPayload,
  parseTrustedWalletList,
  RemoveTrustedWalletPayload,
  TrustedWallet,
  TrustedWalletsSupported,
  ValidateAddressPayload,
  ValidateAddressResult,
} from "../trusted-wallets";

// Every response is { message, details, errorGroup, data }; these return `data`.

export const getTrustedWalletsSupported =
  async (): Promise<TrustedWalletsSupported> => {
    const response = await AxiosInstance.get(
      "/wallets/trusted-wallets/supported",
    );
    return response.data.data;
  };

export const getTrustedWallets = async (filter?: {
  currency?: string;
  network?: string;
}): Promise<TrustedWallet[]> => {
  const response = await AxiosInstance.get("/wallets/trusted-wallets", {
    params: filter,
  });
  return parseTrustedWalletList(response.data?.data);
};

export const validateTrustedWalletAddress = async (
  payload: ValidateAddressPayload,
): Promise<ValidateAddressResult> => {
  const response = await AxiosInstance.post(
    "/wallets/trusted-wallets/validate-address",
    payload,
  );
  return response.data.data;
};

export const addTrustedWallet = async (
  payload: AddTrustedWalletPayload,
): Promise<TrustedWallet> => {
  const response = await AxiosInstance.post(
    "/wallets/trusted-wallets",
    payload,
  );
  return response.data.data;
};

export const renameTrustedWallet = async ({
  id,
  label,
}: {
  id: string;
  label: string;
}): Promise<TrustedWallet> => {
  const response = await AxiosInstance.patch(
    `/wallets/trusted-wallets/${id}`,
    { label },
  );
  return response.data.data;
};

// A POST, not a DELETE: a DELETE with a body is unreliable through proxies.
export const removeTrustedWallet = async ({
  id,
  ...payload
}: RemoveTrustedWalletPayload & { id: string }): Promise<{
  removed: boolean;
}> => {
  const response = await AxiosInstance.post(
    `/wallets/trusted-wallets/${id}/remove`,
    payload,
  );
  return response.data.data;
};
