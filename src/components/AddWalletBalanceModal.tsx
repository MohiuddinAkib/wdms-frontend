import clsx from "clsx";
import { useSnackbar } from "notistack";
import { Delete } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import {
  WalletDenominationResource,
  WalletResource,
} from "@/types/api-response";
import LoadableButton from "@components/ui/LoadableButton";
import {
  useAddWalletBalaneMutation,
  useGetTransactionListQuery,
  useGetWalletDetailsQuery,
  useGetWalletListQuery,
} from "@/hooks/wallet";
import {
  Dialog,
  useTheme,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  Grid,
  List,
  ListItemButton,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  wallet: WalletResource;
};

function AddWalletBalanceModal(props: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const fullWidth = useMediaQuery(theme.breakpoints.down("md"));
  const [denomQuantity, setDenomQuantity] = React.useState<
    Record<string, WalletDenominationResource>
  >({});

  const { mutate: addMoneyTransaction, isPending: isAddingBalance, error, isError, reset } =
    useAddWalletBalaneMutation();

  function handleToggleDenom(denom: WalletDenominationResource) {
    setDenomQuantity((prevState) => {
      const copied = { ...prevState };

      if (denom.id in copied) {
        delete copied[denom.id];
      } else {
        copied[denom.id] = {
          ...denom,
          quantity: 0,
        };
      }

      return copied;
    });
  }

  function handleMoneyAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    addMoneyTransaction(
      {
        walletId: props.wallet.id,
        uuid: props.wallet.id,
        denominations: Object.values(denomQuantity).map((denom) => ({
          denomination_id: denom.id,
          quantity: denom.quantity,
        })),
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
          queryClient.invalidateQueries({
            queryKey: useGetWalletDetailsQuery.getKey({
              walletId: props.wallet.id,
            }),
          });

          queryClient.invalidateQueries({
            queryKey: useGetWalletListQuery.getKey(),
          });

          queryClient.invalidateQueries({
            queryKey: useGetTransactionListQuery.getKey(),
          });

          enqueueSnackbar({
            message: data.message,
            variant: data.success ? "success" : "error",
          });

          props.onClose?.();
          setDenomQuantity({})
        },
      }
    );
  }

  function handleChangeDenomQuantity(
    denom: WalletDenominationResource,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const quantity = e.target.valueAsNumber;

    setDenomQuantity((prevState) => {
      const copied = { ...prevState };

      if (denom.id in copied) {
        copied[denom.id] = {
          ...denom,
          quantity,
        };
      } else {
        copied[denom.id] = {
          ...copied[denom.id],
          quantity,
        };
      }

      return copied;
    });
  }

  const denomQuantityInputs = Object.entries(denomQuantity).map(
    ([denomId, denom], index) => (
      <div key={denomId} className="flex gap-x-2">
        <TextField
          fullWidth
          size={"small"}
          type={"number"}
          value={denom.quantity}
          label={`${denom.name}-${denom.type}`}
          inputProps={{
            min: 0,
          }}
          onChange={handleChangeDenomQuantity.bind(null, denom)}
          error={isError}
          helperText={error?.field_errors?.[`denominations.${index}.quantity`]?.[0]}
        />

        <div>
          <IconButton
            color={"error"}
            onClick={handleToggleDenom.bind(null, denom)}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    )
  );

  function handleOnClose() {
    reset();
    props.onClose?.();
    setDenomQuantity({})
  }

  return (
    <Dialog
      maxWidth={"xl"}
      open={props.open}
      fullWidth={fullWidth}
      onClose={handleOnClose}
      classes={{
        paper: clsx({
          "min-w-[900px]": !fullWidth,
        }),
      }}
    >
      <DialogTitle>Add Balance</DialogTitle>
      <form onSubmit={handleMoneyAdd}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="flex flex-col gap-y-3">
                <List className="h-96">
                  {props.wallet.denominations?.map((eachDenom) => (
                    <React.Fragment key={eachDenom.id}>
                      <ListItemButton
                        divider
                        selected={eachDenom.id in denomQuantity}
                        onClick={handleToggleDenom.bind(null, eachDenom)}
                      >
                        {eachDenom.name} - {eachDenom.type}
                      </ListItemButton>
                    </React.Fragment>
                  ))}
                </List>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div className="flex flex-col gap-y-3 h-96">
                {denomQuantityInputs.length > 0 ? (
                  denomQuantityInputs
                ) : (
                  <Typography align="center">
                    Select a denominations to add balance
                  </Typography>
                )}
              </div>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <LoadableButton
            type={"submit"}
            disableElevation
            variant="contained"
            loading={isAddingBalance}
          >
            Submit
          </LoadableButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddWalletBalanceModal;
