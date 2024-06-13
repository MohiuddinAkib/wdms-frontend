import React from "react";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useGetWalletDetailsQuery } from "@/hooks/wallet";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import WalletDenominationList from "@/components/WalletDenominationList";
import {
  Button,
  Fab,
  Grid,
  Tooltip,
  Typography,
  CardContent,
} from "@mui/material";
import AddWalletBalanceModal from "@/components/AddWalletBalanceModal";
import AddWalletDenominationModal from "@/components/AddWalletDenominationModal";

function WalletDetailsPage() {
  const [openAddDenominationModal, setOpenAddDenominationModal] =
    React.useState(false);
  const [openAddBalanceModal, setOpenAddBalanceModal] = React.useState(false);
  const { walletId } = useParams<{ walletId: string }>();
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
              <div className="flex">
                <div className="flex-1" />
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
            items={walletDetails?.data?.denominations ?? []}
          />
        </Grid>
      </Grid>

      {!!walletDetails && (
        <AddWalletDenominationModal
          open={openAddDenominationModal}
          walletId={walletDetails.data.id}
          currency={walletDetails.data.currency}
          onClose={handleCloseAddDenominationModal}
        />
      )}

      {!!walletDetails && (
        <AddWalletBalanceModal
          open={openAddBalanceModal}
          wallet={walletDetails.data}
          onClose={handleCloseAddBalanceModal}
        />
      )}

      <div className="absolute right-16 bottom-16">
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
