import React from "react";
import { useSnackbar } from "notistack";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import AddWalletBalanceModal from "@/components/AddWalletBalanceModal";
import WalletDenominationList from "@/components/WalletDenominationList";
import AddWalletDenominationModal from "@/components/AddWalletDenominationModal";
import WithdrawWalletBalanceModal from "@/components/WithdrawWalletBalanceModal";
import {
  useGetWalletDetailsQuery,
  useRemoveWalletDenominationMutation,
} from "@/hooks/wallet";
import {
  Fab,
  Grid,
  Button,
  Tooltip,
  Typography,
  CardContent,
} from "@mui/material";

function WalletDetailsPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [openAddDenominationModal, setOpenAddDenominationModal] =
    React.useState(false);
  const [openWithdrawBalanceModal, setOpenWithdrawBalanceModal] =
    React.useState(false);
  const [openAddBalanceModal, setOpenAddBalanceModal] = React.useState(false);
  const { walletId } = useParams<{ walletId: string }>();

  const { mutate: removeWalletDenomination, isPending: isRemoving } =
    useRemoveWalletDenominationMutation();

  const { data: walletDetails, isPending } = useGetWalletDetailsQuery({
    variables: {
      walletId: walletId!,
    },
  });

  if (isPending) {
    return <FullPageSpinner />;
  }

  function handleOpenAddDenominationModal() {
    setOpenAddDenominationModal(true);
  }

  function handleCloseAddDenominationModal() {
    setOpenAddDenominationModal(false);
  }

  function handleOpenAddBalanceModal() {
    setOpenAddBalanceModal(true);
  }

  function handleCloseAddBalanceModal() {
    setOpenAddBalanceModal(false);
  }

  function handleOpenWithdrawBalanceModal() {
    setOpenWithdrawBalanceModal(true);
  }

  function handleCloseWithdrawBalanceModal() {
    setOpenWithdrawBalanceModal(false);
  }

  function handleRemoveWalletDenomination(denominationId: string) {
    removeWalletDenomination(
      {
        walletId: walletId!,
        denominationId,
      },
      {
        onError(error) {
          const firstErrorMsg = Object.values(error.field_errors)[0];

          if (firstErrorMsg) {
            enqueueSnackbar({
              message: firstErrorMsg,
              variant: "error",
            });
          }

          enqueueSnackbar({
            message: error.non_field_error,
            variant: "error",
          });
        },
        onSuccess(data) {
          if(data.success) {
            queryClient.invalidateQueries({
              queryKey: useGetWalletDetailsQuery.getKey({
                walletId: walletId!,
              }),
            });
          }

          enqueueSnackbar({
            message: data.message,
            variant: data.success ? "success" : "error",
          });
        },
      }
    );
  }

  return (
    <div className="mt-2 h-full">
      <Typography variant="h5" align="center" className="my-10">
        Wallet Details
      </Typography>

      <Grid container>
        {!!walletDetails &&
          walletDetails.data.denominations &&
          walletDetails.data.denominations.length > 0 && (
            <Grid item xs={12}>
              <div className="flex gap-x-2">
                <div className="flex-1" />
                <Button
                  disableElevation
                  variant={"outlined"}
                  onClick={handleOpenWithdrawBalanceModal}
                >
                  Withdraw Balance
                </Button>

                <Button
                  variant={"contained"}
                  disableElevation
                  onClick={handleOpenAddBalanceModal}
                >
                  Add Balance
                </Button>
              </div>
            </Grid>
          )}

        <Grid item xs={12} lg={4}>
          <CardContent>
            <Typography>Currency: {walletDetails?.data?.currency}</Typography>
            <Typography>Balance: {walletDetails?.data?.balance}</Typography>
          </CardContent>
        </Grid>

        <Grid item xs={12} className="mt-3">
          <WalletDenominationList
            isRemoving={isRemoving}
            items={walletDetails?.data?.denominations ?? []}
            onDenominationRemove={handleRemoveWalletDenomination}
          />
        </Grid>
      </Grid>

      {!!walletDetails && (
        <AddWalletDenominationModal
          open={openAddDenominationModal}
          walletId={walletDetails.data.id}
          currency={walletDetails.data.currency}
          onClose={handleCloseAddDenominationModal}
          walletDenominations={walletDetails.data.denominations ?? []}
        />
      )}

      {!!walletDetails && (
        <AddWalletBalanceModal
          open={openAddBalanceModal}
          wallet={walletDetails.data}
          onClose={handleCloseAddBalanceModal}
        />
      )}

      {!!walletDetails && (
        <WithdrawWalletBalanceModal
          wallet={walletDetails.data}
          open={openWithdrawBalanceModal}
          onClose={handleCloseWithdrawBalanceModal}
        />
      )}

      <div className="fixed right-16 bottom-16">
        <Tooltip title="Add Denomination">
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpenAddDenominationModal}
          >
            <Add />
          </Fab>
        </Tooltip>
      </div>
    </div>
  );
}

export default WalletDetailsPage;
