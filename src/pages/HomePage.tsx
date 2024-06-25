import React from "react";
import { useSnackbar } from "notistack";
import AppLink from "@/components/ui/AppLink";
import { useQueryClient } from "@tanstack/react-query";
import { Add, Delete, Inbox } from "@mui/icons-material";
import WalletCreateModal from "@/components/WalletCreateModal";
import FullPageSpinner from "@/components/ui/FullPageSpinner";
import {
  useGetWalletDetailsQuery,
  useGetWalletListQuery,
  useRemoveWalletMutation,
} from "@/hooks/wallet";
import {
  Card,
  Fab,
  Grid,
  Tooltip,
  Typography,
  CardContent,
  IconButton,
  CardHeader,
  CardActionArea,
  CircularProgress,
  Alert,
} from "@mui/material";

function HomePage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const { data: wallets, isPending, isError, error } = useGetWalletListQuery();
  const { mutate: removeWallet, isPending: isRemovingWallet } =
    useRemoveWalletMutation();

  if (isPending) {
    return <FullPageSpinner />;
  }

  function handleOpenModal() {
    setOpen(true);
  }

  function handleCloseModal() {
    setOpen(false);
  }

  function handleDeleteWallet(walletId: string, event: React.MouseEvent) {
    event.preventDefault();

    removeWallet(
      {
        walletId,
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
          if (data.success) {
            queryClient.invalidateQueries({
              queryKey: useGetWalletListQuery.getKey(),
            });

            queryClient.invalidateQueries({
              queryKey: useGetWalletDetailsQuery.getKey({ walletId }),
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
        Wallet List
      </Typography>

      {isError ? (
        <Grid container justifyContent={"center"}>
          <Grid item xs={12} lg={7}>
            <Alert color="error">{error.non_field_error}</Alert>
          </Grid>
        </Grid>
      ) : wallets?.data?.length === 0 ? (
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
                  <CardHeader
                    title={`Wallet #${i}`}
                    action={
                      <IconButton
                        disabled={isRemovingWallet}
                        onClick={handleDeleteWallet.bind(null, eachWallet.id)}
                      >
                        {isRemovingWallet ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Delete />
                        )}
                      </IconButton>
                    }
                  />
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
