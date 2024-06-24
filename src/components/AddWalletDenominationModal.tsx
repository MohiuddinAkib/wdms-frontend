import clsx from "clsx";
import { useSnackbar } from "notistack";
import { skipToken } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import LoadableButton from "@components/ui/LoadableButton";
import { WalletDenominationResource } from "@/types/api-response";
import {
  useAddWalletDenominationMutation,
  useGetCurrencyDenominationsQuery,
  useGetWalletDetailsQuery,
} from "@/hooks/wallet";
import {
  Dialog,
  useTheme,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";

type Props = {
  open: boolean;
  currency: string;
  onClose?: () => void;
  walletId: string;
  walletDenominations: WalletDenominationResource[]
};

function AddWalletDenominationModal(props: Props) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const fullWidth = useMediaQuery(theme.breakpoints.down("md"));
  const {
    data: currencyDenominations,
    isPending: isCurrencyDenominationsLoading,
  } = useGetCurrencyDenominationsQuery({
    variables: props.currency
      ? {
          currency: props.currency,
        }
      : skipToken,
  });

  const walletDenominations = new Set(props.walletDenominations.map(eachWalletDenom => `${eachWalletDenom.name}-${eachWalletDenom.type}`))

  const { mutate: addWalletDenomination, isPending: isAddingDenom } =
    useAddWalletDenominationMutation();

  const { control, handleSubmit, setError, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const [name, type] = values.name.split("||");

    if (!name || !type || !currencyDenominations) {
      return;
    }

    const denomination = currencyDenominations.data.find(
      (currencyDenom) =>
        currencyDenom.name === name && currencyDenom.type === type
    );

    if (!denomination) {
      return;
    }

    addWalletDenomination(
      {
        currency: props.currency,
        walletId: props.walletId,
        ...denomination,
      },
      {
        onError(error) {
          if ("name" in error.field_errors) {
            setError("name", {
              type: "api",
              message: error.field_errors.name,
            });
          }

          if ("type" in error.field_errors) {
            setError("name", {
              type: "api",
              message: error.field_errors.type,
            });
          }

          if ("value" in error.field_errors) {
            setError("name", {
              type: "api",
              message: error.field_errors.value,
            });
          }

          enqueueSnackbar({
            variant: "error",
            message: error.non_field_error,
          });
        },
        onSuccess(data) {
          if (data.success) {
            queryClient.invalidateQueries({
              queryKey: useGetWalletDetailsQuery.getKey({
                walletId: props.walletId,
              }),
            });

            enqueueSnackbar({
              variant: "success",
              message: "Denomination added successfully",
            });

            reset();

            props.onClose?.();
          } else {
            enqueueSnackbar({
              variant: "error",
              message: "Failed to add denomination",
            });
          }
        },
      }
    );
  });

  return (
    <Dialog
      open={props.open}
      fullWidth={fullWidth}
      onClose={props.onClose}
      classes={{
        paper: clsx({
          "min-w-[500px]": !fullWidth,
        }),
      }}
    >
      <DialogTitle>Add Denomination</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Controller
            name={"name"}
            control={control}
            render={({ field, fieldState: { error, invalid } }) => {
              return (
                <TextField
                  select
                  fullWidth
                  label={"Select denomination"}
                  disabled={isCurrencyDenominationsLoading}
                  placeholder={
                    isCurrencyDenominationsLoading ? "Loading..." : ""
                  }
                  size="small"
                  {...field}
                  error={invalid}
                  helperText={error?.message}
                >
                  {currencyDenominations?.data?.map((eachCurrDenom, i) => walletDenominations.has(`${eachCurrDenom.name}-${eachCurrDenom.type}`) ? null : (
                    <MenuItem
                      key={i}
                      value={`${eachCurrDenom.name}||${eachCurrDenom.type}`}
                    >
                      {eachCurrDenom.name} - {eachCurrDenom.type}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </DialogContent>

        <DialogActions>
          <LoadableButton
            type={"submit"}
            disableElevation
            variant="contained"
            loading={isCurrencyDenominationsLoading || isAddingDenom}
          >
            Submit
          </LoadableButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddWalletDenominationModal;
