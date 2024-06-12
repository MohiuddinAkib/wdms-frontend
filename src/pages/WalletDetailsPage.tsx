import React from "react";
import { Add } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useGetWalletDetailsQuery } from "@/hooks/wallet";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import WalletDenominationList from "@/components/WalletDenominationList";
import {
  Card,
  CardContent,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import AddWalletDenominationModal from "@/components/AddWalletDenominationModal";

function WalletDetailsPage() {
  const [open, setOpen] = React.useState(false);
  const { walletId } = useParams<{ walletId: string }>();
  const { data: walletDetails, isPending } = useGetWalletDetailsQuery({
    variables: {
      walletId: walletId!,
    },
  });

  if (isPending) {
    return <FullPageSpinner />;
  }

  function handleOpenModal() {
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
  }
  return (
    <div className="mt-2 h-full">
      <Typography variant="h5" align="center" className="my-10">
        Wallet Details
      </Typography>

      <Grid container>
        <Grid item xs={12} lg={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography>Currency: {walletDetails?.data?.currency}</Typography>
              <Typography>Balance: {walletDetails?.data?.balance}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} className="mt-3">
          <Typography className="mb-3">Denominations:</Typography>

          <WalletDenominationList
            items={walletDetails?.data?.denominations ?? []}
          />
        </Grid>
      </Grid>

      {!!walletDetails && (
        <AddWalletDenominationModal
          open={open}
          onClose={handleCloseModal}
          walletId={walletDetails.data.id}
          currency={walletDetails.data.currency}
        />
      )}

      <div className="absolute right-16 bottom-16">
        <Tooltip title="Add Denomination">
          <Fab color="primary" aria-label="add" onClick={handleOpenModal}>
            <Add />
          </Fab>
        </Tooltip>
      </div>
    </div>
  );
}

export default WalletDetailsPage;
