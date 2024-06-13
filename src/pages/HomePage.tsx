import React from "react";
import { Add, Inbox } from "@mui/icons-material";
import { useGetWalletListQuery } from "@/hooks/wallet";
import WalletCreateModal from "@/components/WalletCreateModal";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import {
  Card,
  Fab,
  Grid,
  Tooltip,
  Typography,
  CardContent,
  CardHeader,
  CardActionArea,
} from "@mui/material";
import AppLink from "@/components/ui/AppLink";

function HomePage() {
  const [open, setOpen] = React.useState(false);
  const { data: wallets, isPending } = useGetWalletListQuery();

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
        Wallet List
      </Typography>

      {wallets?.data?.length === 0 ? (
        <div className="text-center h-40 flex items-center justify-center flex-col">
          <Inbox fontSize={"large"} className="mb-4" />
          <Typography align="center">No Wallet Created</Typography>
        </div>
      ) : (
        <Grid container className="mt-2" spacing={2}>
          {wallets?.data?.map((eachWallet, i) => (
            <Grid item lg={4} xs={12} sm={6} key={eachWallet.id}>
              <CardActionArea
                component={AppLink}
                to={`/wallets/${eachWallet.id}`}
              >
                <Card variant="outlined">
                  <CardHeader title={`Wallet #${i}`} />
                  <CardContent>
                    <Typography>Currency: {eachWallet.currency}</Typography>
                    <Typography>Balance: {eachWallet.balance}</Typography>
                  </CardContent>
                </Card>
              </CardActionArea>
            </Grid>
          ))}
        </Grid>
      )}

      <WalletCreateModal open={open} onClose={handleCloseModal} />

      <div className="fixed right-16 bottom-16">
        <Tooltip title="Create new wallet">
          <Fab color="primary" aria-label="add" onClick={handleOpenModal}>
            <Add />
          </Fab>
        </Tooltip>
      </div>
    </div>
  );
}

export default HomePage;
